using Mapster;
using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Shared.Common;
using Microsoft.EntityFrameworkCore;

namespace ThinkTogether.Application.Handlers.QuizSet.Queries.GetAllQuizSets;

public sealed class GetAllQuizSetsQueryHandler : IRequestHandler<GetAllQuizSetsQuery, PaginatedResponse<QuizSetDto>>
{
    private readonly IQuizSetRepository _repository;
    private readonly ICurrentUserService _currentUserService;

    public GetAllQuizSetsQueryHandler(
        IQuizSetRepository repository,
        ICurrentUserService currentUserService)
    {
        _repository = repository;
        _currentUserService = currentUserService;
    }

    public async Task<PaginatedResponse<QuizSetDto>> Handle(
        GetAllQuizSetsQuery request,
        CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(_currentUserService.UserId!);

        var query = _repository.GetByCreatorIdQueryable(userId);

        // Search filter
        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var searchLower = request.Search.ToLower();
            query = query.Where(q => 
                q.Title.ToLower().Contains(searchLower) ||
                (q.Description != null && q.Description.ToLower().Contains(searchLower)));
        }

        // Status filter
        if (request.FilterBy == "published")
        {
            query = query.Where(q => q.IsPublished);
        }
        else if (request.FilterBy == "draft")
        {
            query = query.Where(q => !q.IsPublished);
        }

        // Get total count before pagination
        var total = await query.CountAsync(cancellationToken);

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
        var quizSets = await query
            .Skip(skip)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        return new PaginatedResponse<QuizSetDto>
        {
            Data = quizSets.Adapt<List<QuizSetDto>>(),
            Total = total,
            Page = request.Page,
            PageSize = request.PageSize,
        };
    }
}

