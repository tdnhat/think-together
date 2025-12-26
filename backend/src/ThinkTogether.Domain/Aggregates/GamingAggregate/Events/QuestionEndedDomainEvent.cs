using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.GamingAggregate.Events;

public class QuestionEndedDomainEvent : IDomainEvent
{
    public Guid GameSessionId { get; }
    public Guid GameQuestionId { get; }
    public int PositionInGame { get; }
    public DateTime OccurredOn => DateTime.UtcNow;

    public QuestionEndedDomainEvent(Guid gameSessionId, Guid gameQuestionId, int positionInGame)
    {
        GameSessionId = gameSessionId;
        GameQuestionId = gameQuestionId;
        PositionInGame = positionInGame;
    }
}

