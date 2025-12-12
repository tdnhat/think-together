using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.GamingAggregate.Events;

public class AnswerSubmittedDomainEvent : IDomainEvent
{
    public Guid GameSessionId { get; }
    public Guid PlayerId { get; }
    public Guid GameQuestionId { get; }
    public bool IsCorrect { get; }
    public int PointsEarned { get; }
    public int ResponseTimeMs { get; }
    public DateTime OccurredOn => DateTime.UtcNow;

    public AnswerSubmittedDomainEvent(
        Guid gameSessionId,
        Guid playerId,
        Guid gameQuestionId,
        bool isCorrect,
        int pointsEarned,
        int responseTimeMs)
    {
        GameSessionId = gameSessionId;
        PlayerId = playerId;
        GameQuestionId = gameQuestionId;
        IsCorrect = isCorrect;
        PointsEarned = pointsEarned;
        ResponseTimeMs = responseTimeMs;
    }
}

