using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Shared.Common;

namespace ThinkTogether.Application.Handlers.QuizSet.Queries.GetPublicQuizzes;

public sealed class GetPublicQuizzesQueryHandler : IRequestHandler<GetPublicQuizzesQuery, PaginatedResponse<QuizSetDto>>
{
    private readonly IQuizSetRepository _repository;

    public GetPublicQuizzesQueryHandler(IQuizSetRepository repository)
    {
        _repository = repository;
    }

    public async Task<PaginatedResponse<QuizSetDto>> Handle(
        GetPublicQuizzesQuery request,
        CancellationToken cancellationToken)
    {
        // Get all published quizzes (public discovery)
        var publishedQuizzes = await _repository.GetPublishedAsync(cancellationToken);
        var query = publishedQuizzes.AsQueryable();

        // Search filter
        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var searchLower = request.Search.ToLower();
            query = query.Where(q =>
                q.Title.ToLower().Contains(searchLower) ||
                (q.Description != null && q.Description.ToLower().Contains(searchLower)));
        }

        // Get total count before pagination
        var total = query.Count();

        // Sorting
        query = request.SortBy switch
        {
            "oldest" => query.OrderBy(q => q.CreatedAt),
            "title" => query.OrderBy(q => q.Title),
            "questions" => query.OrderByDescending(q => q.Questions.Count),
            _ => query.OrderByDescending(q => q.UpdatedAt),
        };

        // Pagination
        var skip = (request.Page - 1) * request.PageSize;
        var quizSets = query
            .Skip(skip)
            .Take(request.PageSize)
            .ToList();

        return new PaginatedResponse<QuizSetDto>
        {
            Data = quizSets.Adapt<List<QuizSetDto>>(),
            Total = total,
            Page = request.Page,
            PageSize = request.PageSize,
        };
    }
}

