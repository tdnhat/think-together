using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Shared.Common;

namespace ThinkTogether.Application.Handlers.QuizSet.Queries.GetPublicQuizzes;

public sealed record GetPublicQuizzesQuery : IRequest<PaginatedResponse<QuizSetDto>>
{
    public string? Search { get; init; }
    public string? SortBy { get; init; } // newest, oldest, title, questions
    public int Page { get; init; } = 1;
    public int PageSize { get; init; } = 12;
}

