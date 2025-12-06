using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.GamingAggregate.Events;

public class GameStartedDomainEvent : IDomainEvent
{
    public Guid GameSessionId { get; }
    public int TotalQuestions { get; }
    public int PlayerCount { get; }
    public DateTime OccurredOn => DateTime.UtcNow;

    public GameStartedDomainEvent(Guid gameSessionId, int totalQuestions, int playerCount)
    {
        GameSessionId = gameSessionId;
        TotalQuestions = totalQuestions;
        PlayerCount = playerCount;
    }
}

