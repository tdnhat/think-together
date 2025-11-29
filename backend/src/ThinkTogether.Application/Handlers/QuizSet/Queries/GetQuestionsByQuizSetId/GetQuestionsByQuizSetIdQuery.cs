using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Shared.Common;

namespace ThinkTogether.Application.Handlers.QuizSet.Queries.GetQuestionsByQuizSetId;

public sealed record GetQuestionsByQuizSetIdQuery(Guid QuizSetId) : IRequest<PaginatedResponse<QuestionDto>>
{
    public string? Search { get; init; }
    public string? FilterBy { get; init; } // all, or QuestionType enum value
    public string? SortBy { get; init; } // order, createdAt, type
    public int Page { get; init; } = 1;
    public int PageSize { get; init; } = 50;
}

