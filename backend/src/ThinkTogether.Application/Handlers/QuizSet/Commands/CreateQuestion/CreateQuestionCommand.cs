using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Entities;

namespace ThinkTogether.Application.Handlers.QuizSet.Commands.CreateQuestion;

public sealed record CreateQuestionCommand(
    Guid QuizSetId,
    string Content,
    QuestionType Type,
    int TimeLimit,
    int DisplayOrder = 0,
    List<QuestionOptionDto>? Options = null,
    List<MatchingPairDto>? MatchingPairs = null,
    List<OrderingItemDto>? OrderingItems = null,
    string? VideoUrl = null,
    int? VideoTimestamp = null) : IRequest<QuestionDto>;

