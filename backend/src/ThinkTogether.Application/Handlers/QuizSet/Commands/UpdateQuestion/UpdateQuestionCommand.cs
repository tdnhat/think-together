using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.QuizSet.Commands.UpdateQuestion;

public sealed record UpdateQuestionCommand(
    Guid QuizSetId,
    Guid QuestionId,
    string? Content = null,
    int? TimeLimit = null,
    int? DisplayOrder = null,
    List<QuestionOptionDto>? Options = null,
    List<MatchingPairDto>? MatchingPairs = null,
    List<OrderingItemDto>? OrderingItems = null,
    string? VideoUrl = null,
    int? VideoTimestamp = null) : IRequest<QuestionDto>;

