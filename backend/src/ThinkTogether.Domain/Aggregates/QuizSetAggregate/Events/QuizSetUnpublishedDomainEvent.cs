using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.QuizSetAggregate.Events;

public sealed record QuizSetUnpublishedDomainEvent(Guid QuizSetId) : IDomainEvent;
