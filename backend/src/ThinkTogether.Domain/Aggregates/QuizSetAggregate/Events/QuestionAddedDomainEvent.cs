using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.QuizSetAggregate.Events;

public sealed record QuestionAddedDomainEvent(
    Guid QuizSetId,
    Guid QuestionId,
    string Content) : IDomainEvent;
