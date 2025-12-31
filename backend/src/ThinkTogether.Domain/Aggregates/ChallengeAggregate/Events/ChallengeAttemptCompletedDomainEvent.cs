using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.ChallengeAggregate.Events;

public sealed record ChallengeAttemptCompletedDomainEvent(
    Guid AttemptId,
    Guid ChallengeId,
    Guid? UserId,
    int Score,
    int CorrectAnswers,
    int CompletionTimeMs,
    Guid? HomeworkId) : IDomainEvent;
