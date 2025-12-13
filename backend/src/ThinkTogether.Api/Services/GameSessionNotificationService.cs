using Microsoft.AspNetCore.SignalR;
using ThinkTogether.Api.Hubs;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Repositories;

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

    public async Task NotifyGameStartedAsync(Guid gameSessionId, GameQuestionDto firstQuestion)
    {
        var pin = await _stateService.GetPinByGameSessionIdAsync(gameSessionId);
        if (pin == null) return;

        var gameSession = await _gameSessionRepository.GetByIdAsync(gameSessionId, CancellationToken.None);
        var totalQuestions = gameSession?.GameQuestions.Count ?? 0;
        
        if (totalQuestions > 0)
        {
            await _stateService.SetTotalQuestionsAsync(gameSessionId, totalQuestions);
        }

        var playerCount = await _stateService.GetPlayerCountAsync(pin);

        await _hubContext.Clients.Group($"game_{pin}").GameStarted(new GameStartedMessage(
            gameSessionId,
            totalQuestions,
            playerCount));

        await SendQuestionAsync(pin, firstQuestion, totalQuestions);
    }

    public async Task NotifyNextQuestionAsync(
        Guid gameSessionId,
        List<LeaderboardEntryDto> leaderboard,
        GameQuestionDto? nextQuestion)
    {
        var pin = await _stateService.GetPinByGameSessionIdAsync(gameSessionId);
        if (pin == null) return;

        await _hubContext.Clients.Group($"game_{pin}").LeaderboardUpdated(new LeaderboardUpdatedMessage(
            leaderboard.Select(l => new LeaderboardEntry(
                l.PlayerId,
                l.Nickname,
                l.TotalPoints,
                l.CorrectAnswers,
                l.Rank)).ToList()));

        if (nextQuestion != null)
        {
            var totalQuestions = await _stateService.GetTotalQuestionsAsync(gameSessionId);
            await SendQuestionAsync(pin, nextQuestion, totalQuestions);
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

    private async Task SendQuestionAsync(string pin, GameQuestionDto question, int totalQuestions)
    {
        // Calculate absolute end time for time synchronization
        var endTime = DateTime.UtcNow.AddSeconds(question.TimeLimit);

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
}

