using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.QuizSetAggregate.Events;

public sealed record QuestionRemovedDomainEvent(
    Guid QuizSetId,
    Guid QuestionId) : IDomainEvent;
