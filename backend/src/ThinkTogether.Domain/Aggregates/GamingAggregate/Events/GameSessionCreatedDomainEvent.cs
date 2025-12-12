using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.GamingAggregate.Events;

public class GameSessionCreatedDomainEvent : IDomainEvent
{
    public Guid GameSessionId { get; }
    public Guid HostUserId { get; }
    public Guid QuizSetId { get; }
    public string Pin { get; }
    public DateTime OccurredOn => DateTime.UtcNow;

    public GameSessionCreatedDomainEvent(Guid gameSessionId, Guid hostUserId, Guid quizSetId, string pin)
    {
        GameSessionId = gameSessionId;
        HostUserId = hostUserId;
        QuizSetId = quizSetId;
        Pin = pin;
    }
}

