using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.ChallengeAggregate.Events;

public sealed record ChallengeAttemptStartedDomainEvent(
    Guid ChallengeId,
    Guid AttemptId,
    Guid? UserId,
    string Nickname) : IDomainEvent;
