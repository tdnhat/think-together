using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.ChallengeAggregate.Events;

public sealed record ChallengeActivatedDomainEvent(Guid ChallengeId) : IDomainEvent;
