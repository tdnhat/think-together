using Microsoft.AspNetCore.SignalR;
using ThinkTogether.Api.Hubs;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Specifications;

namespace ThinkTogether.Api.Services;

public class GameSessionNotificationService : IGameSessionNotificationService
{
    private readonly IHubContext<GameHub, IGameHubClient> _hubContext;
    private readonly IGameSessionStateService _stateService;
    private readonly IGameSessionRepository _gameSessionRepository;

    public GameSessionNotificationService(
        IHubContext<GameHub, IGameHubClient> hubContext,
        IGameSessionStateService stateService,
        IGameSessionRepository gameSessionRepository)
    {
        _hubContext = hubContext;
        _stateService = stateService;
        _gameSessionRepository = gameSessionRepository;
    }

    public async Task NotifyGameStartedAsync(Guid gameSessionId, GameQuestionDto firstQuestion, int totalQuestions)
    {
        var pin = await _stateService.GetPinByGameSessionIdAsync(gameSessionId);
        if (pin == null) return;

        // Get connected player count from state service
        var playerCount = await _stateService.GetConnectedPlayerCountAsync(pin);

        await _hubContext.Clients.Group($"game_{pin}").GameStarted(new GameStartedMessage(
            gameSessionId,
            totalQuestions,
            playerCount));

        // QuestionStarted will be sent separately by QuestionStartedDomainEventHandler
    }

    public async Task NotifyNextQuestionAsync(
        Guid gameSessionId,
        List<LeaderboardEntryDto> leaderboard,
        GameQuestionDto? nextQuestion)
    {
        var pin = await _stateService.GetPinByGameSessionIdAsync(gameSessionId);
        if (pin == null) return;

        // LeaderboardUpdated and QuestionStarted will be sent separately by event handlers
        // This method is kept for backward compatibility but may not be called
        await _hubContext.Clients.Group($"game_{pin}").LeaderboardUpdated(new LeaderboardUpdatedMessage(
            leaderboard.Select(l => new LeaderboardEntry(
                l.PlayerId,
                l.Nickname,
                l.TotalPoints,
                l.CorrectAnswers,
                l.Rank)).ToList()));

        if (nextQuestion != null)
        {
            var endTime = DateTime.UtcNow.AddSeconds(nextQuestion.TimeLimit);
            // totalQuestions must represent the total number of questions in the session
            var spec = new GameSessionWithFullDetailsSpec(gameSessionId);
            var gameSession = await _gameSessionRepository.GetBySpecAsync(spec);
            var totalQuestions = gameSession?.GameQuestions.Count ?? 0;

            await NotifyQuestionStartedAsync(pin, nextQuestion, totalQuestions, endTime);
        }
    }

    public async Task NotifyGameEndedAsync(Guid gameSessionId, GameResultDto result)
    {
        var pin = await _stateService.GetPinByGameSessionIdAsync(gameSessionId);
        if (pin == null) return;

        await _hubContext.Clients.Group($"game_{pin}").GameEnded(new GameEndedMessage(
            result.GameSessionId,
            result.TotalQuestions,
            result.TotalPlayers,
            result.Duration,
            result.FinalLeaderboard.Select(l => new LeaderboardEntry(
                l.PlayerId,
                l.Nickname,
                l.TotalPoints,
                l.CorrectAnswers,
                l.Rank)).ToList()));

        await _stateService.CleanupGameSessionAsync(pin);
    }

    public async Task NotifyQuestionStartedAsync(string pin, GameQuestionDto question, int totalQuestions, DateTime endTime)
    {
        await _hubContext.Clients.Group($"game_{pin}").QuestionStarted(new QuestionStartedMessage(
            question.GameQuestionId,
            question.Id,
            question.Content,
            question.Type.ToString(),
            question.TimeLimit,
            endTime,
            question.PositionInGame,
            totalQuestions,
            question.VideoUrl,
            question.VideoTimestamp,
            question.Options.Select(o => new QuestionOptionInfo(o.Index, o.Content, o.ImageUrl)).ToList()));
    }

    public async Task NotifyAnswerReceivedAsync(string pin, Guid playerId, int answeredCount, int totalPlayers)
    {
        await _hubContext.Clients.Group($"host_{pin}").AnswerReceived(new AnswerReceivedMessage(
            playerId,
            answeredCount,
            totalPlayers));
    }

    public async Task NotifyQuestionEndedAsync(
        string pin,
        Guid gameQuestionId,
        List<int> correctOptionIndexes,
        int correctAnswerCount,
        int wrongAnswerCount,
        List<LeaderboardEntryDto> topPlayers)
    {
        // Send QuestionEnded to all players
        await _hubContext.Clients.Group($"game_{pin}").QuestionEnded(new QuestionEndedMessage(
            gameQuestionId,
            correctOptionIndexes,
            correctAnswerCount,
            wrongAnswerCount,
            topPlayers.Select(p => new LeaderboardEntry(
                p.PlayerId,
                p.Nickname,
                p.TotalPoints,
                p.CorrectAnswers,
                p.Rank)).ToList()));

        // Send LeaderboardUpdated to all clients
        await _hubContext.Clients.Group($"game_{pin}").LeaderboardUpdated(new LeaderboardUpdatedMessage(
            topPlayers.Select(p => new LeaderboardEntry(
                p.PlayerId,
                p.Nickname,
                p.TotalPoints,
                p.CorrectAnswers,
                p.Rank)).ToList()));
    }

    public async Task NotifyPlayerJoinedAsync(string pin, Guid playerId, string nickname, int totalPlayers)
    {
        await _hubContext.Clients.Group($"game_{pin}").PlayerJoined(new PlayerJoinedMessage(
            playerId,
            nickname,
            totalPlayers));
    }
}

