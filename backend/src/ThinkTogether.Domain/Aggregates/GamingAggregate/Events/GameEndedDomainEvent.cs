using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.GamingAggregate.Events;

public class GameEndedDomainEvent : IDomainEvent
{
    public Guid GameSessionId { get; }
    public DateTime OccurredOn => DateTime.UtcNow;

    public GameEndedDomainEvent(Guid gameSessionId)
    {
        GameSessionId = gameSessionId;
    }
}

