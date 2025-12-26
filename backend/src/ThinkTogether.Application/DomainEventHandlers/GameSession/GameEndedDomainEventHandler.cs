using MediatR;
using Microsoft.Extensions.Logging;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Events;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Specifications;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Services;

namespace ThinkTogether.Application.DomainEventHandlers.GameSession;

public class GameEndedDomainEventHandler : INotificationHandler<GameEndedDomainEvent>
{
    private readonly IGameSessionRepository _gameSessionRepository;
    private readonly ILeaderboardService _leaderboardService;
    private readonly IGameSessionNotificationService _notificationService;
    private readonly ILogger<GameEndedDomainEventHandler> _logger;

    public GameEndedDomainEventHandler(
        IGameSessionRepository gameSessionRepository,
        ILeaderboardService leaderboardService,
        IGameSessionNotificationService notificationService,
        ILogger<GameEndedDomainEventHandler> logger)
    {
        _gameSessionRepository = gameSessionRepository;
        _leaderboardService = leaderboardService;
        _notificationService = notificationService;
        _logger = logger;
    }

    public async Task Handle(GameEndedDomainEvent notification, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Processing GameEnded event for session {GameSessionId}", notification.GameSessionId);

            var spec = new GameSessionWithFullDetailsSpec(notification.GameSessionId);
            var gameSession = await _gameSessionRepository.GetBySpecAsync(spec, cancellationToken);
            if (gameSession == null)
            {
                _logger.LogWarning("Game session {GameSessionId} not found for GameEnded event", notification.GameSessionId);
                return;
            }

            // Build final leaderboard
            var finalLeaderboard = _leaderboardService.BuildFinalLeaderboard(gameSession);
            var leaderboardDto = finalLeaderboard
                .Select(e => new LeaderboardEntryDto
                {
                    PlayerId = e.PlayerId,
                    Nickname = e.Nickname,
                    TotalPoints = e.TotalPoints,
                    CorrectAnswers = e.CorrectAnswers,
                    Rank = e.Rank,
                    AccuracyPercentage = e.AccuracyPercentage,
                    TotalTimeSpentMs = e.TotalTimeSpentMs
                })
                .ToList();

            var result = new GameResultDto
            {
                GameSessionId = gameSession.Id,
                TotalQuestions = gameSession.GameQuestions.Count,
                TotalPlayers = gameSession.Players.Count,
                StartedAt = gameSession.StartedAt ?? DateTime.UtcNow,
                EndedAt = gameSession.EndedAt ?? DateTime.UtcNow,
                Duration = (gameSession.EndedAt ?? DateTime.UtcNow) - (gameSession.StartedAt ?? DateTime.UtcNow),
                FinalLeaderboard = leaderboardDto
            };

            await _notificationService.NotifyGameEndedAsync(gameSession.Id, result);

            _logger.LogInformation("GameEnded event processed successfully for session {GameSessionId}", notification.GameSessionId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing GameEnded event for session {GameSessionId}", notification.GameSessionId);
        }
    }
}

