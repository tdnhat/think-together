using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.QuizSetAggregate.Events;

public sealed record QuizSetCreatedDomainEvent(
    Guid QuizSetId,
    Guid CreatorId,
    string Title) : IDomainEvent;
