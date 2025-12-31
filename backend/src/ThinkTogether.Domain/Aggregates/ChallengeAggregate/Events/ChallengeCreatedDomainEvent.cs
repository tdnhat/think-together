using Shared.Primitives;
using ThinkTogether.Domain.Enums;

namespace ThinkTogether.Domain.Aggregates.ChallengeAggregate.Events;

public sealed record ChallengeCreatedDomainEvent(
    Guid ChallengeId,
    Guid CreatorId,
    Guid QuizSetId,
    string Title,
    string ShareLink) : IDomainEvent;
