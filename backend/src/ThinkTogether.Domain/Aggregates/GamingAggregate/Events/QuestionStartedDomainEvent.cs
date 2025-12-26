using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.GamingAggregate.Events;

public class QuestionStartedDomainEvent : IDomainEvent
{
    public Guid GameSessionId { get; }
    public Guid GameQuestionId { get; }
    public int PositionInGame { get; }
    public DateTime OccurredOn => DateTime.UtcNow;

    public QuestionStartedDomainEvent(Guid gameSessionId, Guid gameQuestionId, int positionInGame)
    {
        GameSessionId = gameSessionId;
        GameQuestionId = gameQuestionId;
        PositionInGame = positionInGame;
    }
}

