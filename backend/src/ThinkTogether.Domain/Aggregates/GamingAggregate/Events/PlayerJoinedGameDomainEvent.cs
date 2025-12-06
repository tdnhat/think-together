using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.GamingAggregate.Events;

public class PlayerJoinedGameDomainEvent : IDomainEvent
{
    public Guid GameSessionId { get; }
    public Guid PlayerId { get; }
    public string Nickname { get; }
    public DateTime OccurredOn => DateTime.UtcNow;

    public PlayerJoinedGameDomainEvent(Guid gameSessionId, Guid playerId, string nickname)
    {
        GameSessionId = gameSessionId;
        PlayerId = playerId;
        Nickname = nickname;
    }
}

