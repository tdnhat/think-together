using MediatR;
using Microsoft.AspNetCore.SignalR;
using ThinkTogether.Application.Handlers.GameSession.Commands.JoinGameSession;
using ThinkTogether.Application.Handlers.GameSession.Commands.ReconnectPlayer;
using ThinkTogether.Application.Handlers.GameSession.Commands.SubmitAnswer;
using ThinkTogether.Application.Interfaces;

namespace ThinkTogether.Api.Hubs;

public class GameHub : Hub<IGameHubClient>
{
    private readonly IMediator _mediator;
    private readonly ILogger<GameHub> _logger;
    private readonly IGameSessionStateService _stateService;
    private readonly IQuestionTimerService _questionTimerService;
    private readonly IDistributedLockService _lockService;

    public GameHub(
        IMediator mediator,
        ILogger<GameHub> logger,
        IGameSessionStateService stateService,
        IQuestionTimerService questionTimerService,
        IDistributedLockService lockService)
    {
        _mediator = mediator;
        _logger = logger;
        _stateService = stateService;
        _questionTimerService = questionTimerService;
        _lockService = lockService;
    }

    public async Task JoinGame(string pin, string nickname)
    {
        try
        {
            _logger.LogInformation("Player {Nickname} attempting to join game with PIN {Pin}", nickname, pin);

            // Send command to join game session (fires PlayerJoinedGameDomainEvent)
            var command = new JoinGameSessionCommand(pin, nickname);
            var player = await _mediator.Send(command);

            // Track connection for this player
            await _stateService.AddPlayerConnectionAsync(pin, player.Id, Context.ConnectionId, player.Nickname);

            // Add to game group for receiving broadcasts
            await Groups.AddToGroupAsync(Context.ConnectionId, GetGameGroup(pin));

            // PlayerJoined notification will be sent by PlayerJoinedGameDomainEventHandler
            _logger.LogInformation("Player {PlayerId} ({Nickname}) joined game {Pin}", player.Id, nickname, pin);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error joining game with PIN {Pin}", pin);
            await Clients.Caller.Error(new ErrorMessage("JOIN_FAILED", ex.Message));
        }
    }

    public async Task JoinAsHost(Guid gameSessionId, string pin)
    {
        try
        {
            _logger.LogInformation("Host joining game session {GameSessionId}", gameSessionId);

            await _stateService.SetHostConnectionAsync(pin, Context.ConnectionId);

            await Groups.AddToGroupAsync(Context.ConnectionId, GetGameGroup(pin));
            await Groups.AddToGroupAsync(Context.ConnectionId, GetHostGroup(pin));

            _logger.LogInformation("Host connected to game session {GameSessionId}", gameSessionId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error joining as host for game session {GameSessionId}", gameSessionId);
            await Clients.Caller.Error(new ErrorMessage("HOST_JOIN_FAILED", ex.Message));
        }
    }

    public async Task Reconnect(string pin, Guid playerId)
    {
        try
        {
            _logger.LogInformation("Player {PlayerId} attempting to reconnect to game {Pin}", playerId, pin);

            var command = new ReconnectPlayerCommand(pin, playerId, Context.ConnectionId);
            var result = await _mediator.Send(command);

            if (!result.Success)
            {
                await Clients.Caller.Error(new ErrorMessage("RECONNECT_FAILED", "Không thể kết nối lại. Phiên trò chơi không tồn tại hoặc bạn không phải là người chơi."));
                return;
            }

            // Track connection with nickname from result
            var nickname = result.Player?.Nickname ?? "";
            await _stateService.AddPlayerConnectionAsync(pin, playerId, Context.ConnectionId, nickname);

            await Groups.AddToGroupAsync(Context.ConnectionId, GetGameGroup(pin));

            // Note: Don't broadcast PlayerJoined for reconnecting players - they already exist in the game
            // Only send updates to the reconnecting player themselves

            if (result.CurrentQuestion != null)
            {
                // Get end time from timer service for time synchronization
                var endTime = await _questionTimerService.GetQuestionEndTimeAsync(result.GameSession!.Id);
                endTime ??= DateTime.UtcNow.AddSeconds(result.CurrentQuestion.TimeLimit);

                await Clients.Caller.QuestionStarted(new QuestionStartedMessage(
                    result.CurrentQuestion.GameQuestionId,
                    result.CurrentQuestion.Id,
                    result.CurrentQuestion.Content,
                    result.CurrentQuestion.Type.ToString(),
                    result.CurrentQuestion.TimeLimit,
                    endTime.Value,
                    result.CurrentQuestion.PositionInGame,
                    result.GameSession?.TotalQuestions ?? 0,
                    result.CurrentQuestion.VideoUrl,
                    result.CurrentQuestion.VideoTimestamp,
                    result.CurrentQuestion.AudioUrl,
                    result.CurrentQuestion.AudioTimestamp,
                    result.CurrentQuestion.Options.Select(o => new QuestionOptionInfo(o.Index, o.Content, o.ImageUrl)).ToList(),
                    result.CurrentQuestion.MatchingLeft.Select(m => new MatchingItemInfo(m.Id, m.Content)).ToList(),
                    result.CurrentQuestion.MatchingRight.Select(m => new MatchingItemInfo(m.Id, m.Content)).ToList(),
                    result.CurrentQuestion.OrderingItems.Select(o => new OrderingItemInfo(o.Id, o.Content)).ToList()));
            }

            if (result.Leaderboard != null && result.Leaderboard.Count > 0)
            {
                await Clients.Caller.LeaderboardUpdated(new LeaderboardUpdatedMessage(
                    result.Leaderboard.Select(l => new LeaderboardEntry(
                        l.PlayerId,
                        l.Nickname,
                        l.TotalPoints,
                        l.CorrectAnswers,
                        l.Rank)).ToList()));
            }

            _logger.LogInformation("Player {PlayerId} successfully reconnected to game {Pin}", playerId, pin);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error reconnecting player {PlayerId} to game {Pin}", playerId, pin);
            await Clients.Caller.Error(new ErrorMessage("RECONNECT_FAILED", ex.Message));
        }
    }

    public async Task SubmitAnswer(Guid gameSessionId, Guid playerId, Guid gameQuestionId, List<int> selectedOptionIndexes, int responseTimeMs)
    {
        // Acquire lock to prevent duplicate submissions
        var lockKey = $"game:{gameSessionId}:answer:{playerId}:{gameQuestionId}";
        await using var @lock = await _lockService.TryAcquireLockAsync(lockKey, TimeSpan.FromSeconds(10));
        
        if (@lock?.IsAcquired != true)
        {
            _logger.LogWarning("Player {PlayerId} duplicate answer submission detected for question {QuestionId}", playerId, gameQuestionId);
            await Clients.Caller.Error(new ErrorMessage("SUBMISSION_IN_PROGRESS", "Đang xử lý câu trả lời..."));
            return;
        }

        try
        {
            _logger.LogInformation("Player {PlayerId} submitting answer for question {QuestionId}", playerId, gameQuestionId);

            // Send command to submit answer (fires AnswerSubmittedDomainEvent)
            var command = new SubmitAnswerCommand(
                gameSessionId,
                playerId,
                gameQuestionId,
                selectedOptionIndexes,
                responseTimeMs);

            var result = await _mediator.Send(command);

            // AnswerReceived notification will be sent by AnswerSubmittedDomainEventHandler
            _logger.LogInformation("Player {PlayerId} submitted answer: {IsCorrect}, Points: {Points}", 
                playerId, result.IsCorrect, result.PointsEarned);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error submitting answer for player {PlayerId}", playerId);
            await Clients.Caller.Error(new ErrorMessage("SUBMIT_FAILED", ex.Message));
        }
    }

    public async Task LeaveGame(string pin, Guid playerId)
    {
        try
        {
            _logger.LogInformation("Player {PlayerId} leaving game {Pin}", playerId, pin);

            // Get player info before removing connection
            var playerInfo = await _stateService.GetPlayerByConnectionIdAsync(Context.ConnectionId);
            var nickname = playerInfo?.Nickname ?? "Unknown";

            // Explicitly called leave, so we remove the player regardless of connection check
            await _stateService.RemovePlayerConnectionAsync(pin, playerId);

            await Groups.RemoveFromGroupAsync(Context.ConnectionId, GetGameGroup(pin));

            var playerCount = await _stateService.GetConnectedPlayerCountAsync(pin);

            await Clients.Group(GetGameGroup(pin)).PlayerLeft(new PlayerLeftMessage(
                playerId,
                nickname,
                playerCount));

            _logger.LogInformation("Player {PlayerId} left game {Pin}", playerId, pin);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error leaving game for player {PlayerId}", playerId);
        }
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        _logger.LogInformation("Client disconnected: {ConnectionId}", Context.ConnectionId);

        var playerInfo = await _stateService.GetPlayerByConnectionIdAsync(Context.ConnectionId);
        if (playerInfo != null)
        {
            // Only remove if this connection is the active one for the player
            var removed = await _stateService.RemovePlayerConnectionAsync(playerInfo.Pin, playerInfo.PlayerId, Context.ConnectionId);
            
            if (removed)
            {
                // Mark player as disconnected (not left) so they can reconnect
                await _stateService.SetPlayerStateAsync(playerInfo.Pin, playerInfo.PlayerId, Domain.Enums.ConnectionStatus.Disconnected);
                
                var playerCount = await _stateService.GetConnectedPlayerCountAsync(playerInfo.Pin);
                
                // Notify other players that this player is temporarily disconnected
                await Clients.Group(GetGameGroup(playerInfo.Pin)).PlayerDisconnected(new PlayerDisconnectedMessage(
                    playerInfo.PlayerId,
                    playerInfo.Nickname,
                    playerCount));
            }
        }

        await base.OnDisconnectedAsync(exception);
    }

    private static string GetGameGroup(string pin) => $"game_{pin}";
    private static string GetHostGroup(string pin) => $"host_{pin}";
}
