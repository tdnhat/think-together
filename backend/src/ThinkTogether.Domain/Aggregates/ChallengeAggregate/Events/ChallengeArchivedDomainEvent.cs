using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.ChallengeAggregate.Events;

public sealed record ChallengeArchivedDomainEvent(Guid ChallengeId) : IDomainEvent;
