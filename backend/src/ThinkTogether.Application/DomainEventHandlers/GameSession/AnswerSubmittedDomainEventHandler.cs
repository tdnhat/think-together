using MediatR;
using Microsoft.Extensions.Logging;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Events;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Specifications;

namespace ThinkTogether.Application.DomainEventHandlers.GameSession;

public class AnswerSubmittedDomainEventHandler : INotificationHandler<AnswerSubmittedDomainEvent>
{
    private readonly IGameSessionRepository _gameSessionRepository;
    private readonly IGameSessionNotificationService _notificationService;
    private readonly IGameSessionStateService _stateService;
    private readonly ILogger<AnswerSubmittedDomainEventHandler> _logger;

    public AnswerSubmittedDomainEventHandler(
        IGameSessionRepository gameSessionRepository,
        IGameSessionNotificationService notificationService,
        IGameSessionStateService stateService,
        ILogger<AnswerSubmittedDomainEventHandler> logger)
    {
        _gameSessionRepository = gameSessionRepository;
        _notificationService = notificationService;
        _stateService = stateService;
        _logger = logger;
    }

    public async Task Handle(AnswerSubmittedDomainEvent notification, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Processing AnswerSubmitted event for player {PlayerId} in session {GameSessionId}",
                notification.PlayerId, notification.GameSessionId);

            var spec = new GameSessionWithFullDetailsSpec(notification.GameSessionId);
            var gameSession = await _gameSessionRepository.GetBySpecAsync(spec, cancellationToken);
            if (gameSession == null)
            {
                _logger.LogWarning("Game session {GameSessionId} not found for AnswerSubmitted event", notification.GameSessionId);
                return;
            }

            var pin = gameSession.PIN;

            // Count answers for the current question
            var answeredCount = gameSession.PlayerAnswers
                .Count(a => a.GameQuestionId == notification.GameQuestionId);

            var totalPlayers = gameSession.Players.Count;

            // Notify host about the answer
            await _notificationService.NotifyAnswerReceivedAsync(
                pin,
                notification.PlayerId,
                answeredCount,
                totalPlayers);

            _logger.LogInformation("AnswerSubmitted event processed successfully for player {PlayerId}", notification.PlayerId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing AnswerSubmitted event for player {PlayerId}", notification.PlayerId);
        }
    }
}

