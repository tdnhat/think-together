using MediatR;
using Microsoft.Extensions.Logging;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Events;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Specifications;

namespace ThinkTogether.Application.DomainEventHandlers.GameSession;

public class PlayerJoinedGameDomainEventHandler : INotificationHandler<PlayerJoinedGameDomainEvent>
{
    private readonly IGameSessionRepository _gameSessionRepository;
    private readonly IGameSessionNotificationService _notificationService;
    private readonly ILogger<PlayerJoinedGameDomainEventHandler> _logger;

    public PlayerJoinedGameDomainEventHandler(
        IGameSessionRepository gameSessionRepository,
        IGameSessionNotificationService notificationService,
        ILogger<PlayerJoinedGameDomainEventHandler> logger)
    {
        _gameSessionRepository = gameSessionRepository;
        _notificationService = notificationService;
        _logger = logger;
    }

    public async Task Handle(PlayerJoinedGameDomainEvent notification, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Processing PlayerJoined event for player {PlayerId} ({Nickname}) in session {GameSessionId}",
                notification.PlayerId, notification.Nickname, notification.GameSessionId);

            var spec = new GameSessionWithFullDetailsSpec(notification.GameSessionId);
            var gameSession = await _gameSessionRepository.GetBySpecAsync(spec, cancellationToken);
            if (gameSession == null)
            {
                _logger.LogWarning("Game session {GameSessionId} not found for PlayerJoined event", notification.GameSessionId);
                return;
            }

            var pin = gameSession.PIN;
            var totalPlayers = gameSession.Players.Count;

            await _notificationService.NotifyPlayerJoinedAsync(
                pin,
                notification.PlayerId,
                notification.Nickname,
                totalPlayers);

            _logger.LogInformation("PlayerJoined event processed successfully for player {PlayerId}", notification.PlayerId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing PlayerJoined event for player {PlayerId}", notification.PlayerId);
        }
    }
}

