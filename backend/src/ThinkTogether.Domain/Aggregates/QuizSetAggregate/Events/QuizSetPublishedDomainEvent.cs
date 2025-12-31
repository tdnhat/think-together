using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.QuizSetAggregate.Events;

public sealed record QuizSetPublishedDomainEvent(Guid QuizSetId) : IDomainEvent;
