using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.UserAggregate.Repositories;
using ThinkTogether.Shared.Common;

namespace ThinkTogether.Application.Handlers.QuizSet.Queries.GetPublicQuizzes;

public sealed class GetPublicQuizzesQueryHandler : IRequestHandler<GetPublicQuizzesQuery, PaginatedResponse<QuizSetDto>>
{
    private readonly IQuizSetRepository _repository;
    private readonly IUserRepository _userRepository;

    public GetPublicQuizzesQueryHandler(IQuizSetRepository repository, IUserRepository userRepository)
    {
        _repository = repository;
        _userRepository = userRepository;
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

        // Get creator information for the quiz sets
        var creatorIds = quizSets.Select(q => q.CreatorId).Distinct().ToList();
        var creatorDict = new Dictionary<Guid, string>();

        foreach (var creatorId in creatorIds)
        {
            var creator = await _userRepository.GetByIdAsync(creatorId, cancellationToken);
            if (creator != null)
            {
                creatorDict[creatorId] = $"{creator.FirstName} {creator.LastName}".Trim();
            }
        }

        var dtos = quizSets.Adapt<List<QuizSetDto>>();
        foreach (var dto in dtos)
        {
            dto.CreatorName = creatorDict.TryGetValue(dto.CreatorId, out var name) ? name : "Unknown Creator";
        }

        return new PaginatedResponse<QuizSetDto>
        {
            Data = dtos,
            Total = total,
            Page = request.Page,
            PageSize = request.PageSize,
        };
    }
}

