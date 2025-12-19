using Mapster;
using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Shared.Common;
using ThinkTogether.Domain.Enums;
using ThinkTogether.Domain.Exceptions;

namespace ThinkTogether.Application.Handlers.QuizSet.Queries.GetQuestionsByQuizSetId;

public sealed class GetQuestionsByQuizSetIdQueryHandler : IRequestHandler<GetQuestionsByQuizSetIdQuery, PaginatedResponse<QuestionDto>>
{
    private readonly IQuizSetRepository _repository;
    private readonly ICurrentUserService _currentUserService;

    public GetQuestionsByQuizSetIdQueryHandler(
        IQuizSetRepository repository,
        ICurrentUserService currentUserService)
    {
        _repository = repository;
        _currentUserService = currentUserService;
    }

    public async Task<PaginatedResponse<QuestionDto>> Handle(
        GetQuestionsByQuizSetIdQuery request,
        CancellationToken cancellationToken)
    {
        var quizSet = await _repository.GetByIdAsync(request.QuizSetId, cancellationToken);
        if (quizSet == null)
            throw new EntityNotFoundException(nameof(QuizSet), request.QuizSetId);

        var query = quizSet.Questions.AsQueryable();

        // Search filter
        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var searchLower = request.Search.ToLower();
            query = query.Where(q => q.Content.ToLower().Contains(searchLower));
        }

        // Type filter
        if (!string.IsNullOrWhiteSpace(request.FilterBy) && request.FilterBy != "all")
        {
            if (Enum.TryParse<QuestionType>(request.FilterBy, true, out var questionType))
            {
                query = query.Where(q => q.Type == questionType);
            }
        }

        // Get total count before pagination
        var total = query.Count();

        // Sorting
        query = request.SortBy switch
        {
            "createdAt" => query.OrderBy(q => q.CreatedAt),
            "type" => query.OrderBy(q => q.Type).ThenBy(q => q.DisplayOrder),
            _ => query.OrderBy(q => q.DisplayOrder).ThenBy(q => q.CreatedAt),
        };

        // Pagination
        var skip = (request.Page - 1) * request.PageSize;
        var questions = query
            .Skip(skip)
            .Take(request.PageSize)
            .ToList();

        return new PaginatedResponse<QuestionDto>
        {
            Data = questions.Adapt<List<QuestionDto>>(),
            Total = total,
            Page = request.Page,
            PageSize = request.PageSize,
        };
    }
}

