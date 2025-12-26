using MediatR;
using Microsoft.Extensions.Logging;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Events;

namespace ThinkTogether.Application.DomainEventHandlers.GameSession;

public class GameSessionCreatedDomainEventHandler : INotificationHandler<GameSessionCreatedDomainEvent>
{
    private readonly IGameSessionStateService _stateService;
    private readonly ILogger<GameSessionCreatedDomainEventHandler> _logger;

    public GameSessionCreatedDomainEventHandler(
        IGameSessionStateService stateService,
        ILogger<GameSessionCreatedDomainEventHandler> logger)
    {
        _stateService = stateService;
        _logger = logger;
    }

    public async Task Handle(GameSessionCreatedDomainEvent notification, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Processing GameSessionCreated event for session {GameSessionId} with PIN {Pin}",
                notification.GameSessionId, notification.Pin);

            // Set up PIN mapping for SignalR group management
            await _stateService.SetGameSessionPinMappingAsync(notification.GameSessionId, notification.Pin);

            _logger.LogInformation("PIN mapping set up for session {GameSessionId}", notification.GameSessionId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing GameSessionCreated event for session {GameSessionId}", notification.GameSessionId);
        }
    }
}

