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

    public GameHub(
        IMediator mediator,
        ILogger<GameHub> logger,
        IGameSessionStateService stateService,
        IQuestionTimerService questionTimerService)
    {
        _mediator = mediator;
        _logger = logger;
        _stateService = stateService;
        _questionTimerService = questionTimerService;
    }

    public async Task JoinGame(string pin, string nickname)
    {
        try
        {
            _logger.LogInformation("Player {Nickname} attempting to join game with PIN {Pin}", nickname, pin);

            var command = new JoinGameSessionCommand(pin, nickname);
            var player = await _mediator.Send(command);

            // Check if this player already has an active connection (returning player)
            // We check by player ID, not connection ID, to properly detect reconnects
            var existingPlayerConnection = await _stateService.GetPlayerConnectionAsync(pin, player.Id);
            var isNewPlayer = string.IsNullOrEmpty(existingPlayerConnection);

            await _stateService.AddPlayerConnectionAsync(pin, player.Id, Context.ConnectionId);

            await Groups.AddToGroupAsync(Context.ConnectionId, GetGameGroup(pin));

            // Only broadcast PlayerJoined for genuinely new players to avoid duplicates
            if (isNewPlayer)
            {
                var playerCount = await _stateService.GetPlayerCountAsync(pin);

                await Clients.Group(GetGameGroup(pin)).PlayerJoined(new PlayerJoinedMessage(
                    player.Id,
                    player.Nickname,
                    playerCount));

                _logger.LogInformation("Player {PlayerId} ({Nickname}) joined game {Pin}", player.Id, nickname, pin);
            }
            else
            {
                _logger.LogInformation("Player {PlayerId} ({Nickname}) reconnected to game {Pin} (already had connection)", player.Id, nickname, pin);
            }
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

            await _stateService.AddPlayerConnectionAsync(pin, playerId, Context.ConnectionId);

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
                    result.CurrentQuestion.Options.Select(o => new QuestionOptionInfo(o.Index, o.Content, o.ImageUrl)).ToList()));
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
        try
        {
            _logger.LogInformation("Player {PlayerId} submitting answer for question {QuestionId}", playerId, gameQuestionId);

            var command = new SubmitAnswerCommand(
                gameSessionId,
                playerId,
                gameQuestionId,
                selectedOptionIndexes,
                responseTimeMs);

            var result = await _mediator.Send(command);

            var pin = await _stateService.GetPinByGameSessionIdAsync(gameSessionId);
            if (pin != null)
            {
                var answeredCount = await _stateService.IncrementAnswerCountAsync(pin, gameQuestionId);
                var totalPlayers = await _stateService.GetPlayerCountAsync(pin);

                await Clients.Group(GetHostGroup(pin)).AnswerReceived(new AnswerReceivedMessage(
                    playerId,
                    answeredCount,
                    totalPlayers));
            }

            await Clients.Caller.AnswerReceived(new AnswerReceivedMessage(
                playerId,
                1,
                1));

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

            var nickname = await _stateService.GetPlayerNicknameAsync(pin, playerId);
            
            // Explicitly called leave, so we remove the player regardless of connection check
            await _stateService.RemovePlayerConnectionAsync(pin, playerId);

            await Groups.RemoveFromGroupAsync(Context.ConnectionId, GetGameGroup(pin));

            var playerCount = await _stateService.GetPlayerCountAsync(pin);

            await Clients.Group(GetGameGroup(pin)).PlayerLeft(new PlayerLeftMessage(
                playerId,
                nickname ?? "Unknown",
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
                var playerCount = await _stateService.GetPlayerCountAsync(playerInfo.Pin);
                
                await Clients.Group(GetGameGroup(playerInfo.Pin)).PlayerLeft(new PlayerLeftMessage(
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
