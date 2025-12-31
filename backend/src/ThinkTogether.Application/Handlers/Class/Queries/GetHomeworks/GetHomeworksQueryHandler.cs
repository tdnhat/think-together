using Mapster;
using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.ClassAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Repositories;
using ThinkTogether.Domain.Exceptions;

namespace ThinkTogether.Application.Handlers.Class.Queries.GetHomeworks;

public sealed class GetHomeworksQueryHandler : IRequestHandler<GetHomeworksQuery, HomeworkResponseDto>
{
    private readonly IClassRepository _classRepository;
    private readonly IQuizSetRepository _quizSetRepository;

    public GetHomeworksQueryHandler(
        IClassRepository classRepository,
        IQuizSetRepository quizSetRepository)
    {
        _classRepository = classRepository;
        _quizSetRepository = quizSetRepository;
    }

    public async Task<HomeworkResponseDto> Handle(
        GetHomeworksQuery request,
        CancellationToken cancellationToken)
    {
        var classEntity = await _classRepository.GetByIdAsync(request.ClassId, cancellationToken);
        if (classEntity == null)
        {
            throw new EntityNotFoundException(nameof(Class), request.ClassId);
        }

        // Filter out deleted homeworks
        var homeworks = classEntity.Homeworks
            .Where(h => h.DeletedAt == null)
            .ToList();

        // Get quiz set titles
        var quizSetIds = homeworks.Select(h => h.QuizSetId).Distinct().ToList();
        var quizSets = new Dictionary<Guid, string>();
        foreach (var quizSetId in quizSetIds)
        {
            var quizSet = await _quizSetRepository.GetByIdAsync(quizSetId, cancellationToken);
            if (quizSet != null)
            {
                quizSets[quizSetId] = quizSet.Title;
            }
        }

        // Pagination
        var total = homeworks.Count;
        var totalPages = (int)Math.Ceiling(total / (double)request.PageSize);
        var pagedHomeworks = homeworks
            .OrderByDescending(h => h.AssignedAt)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToList();

        var dtos = pagedHomeworks.Select(h =>
        {
            var dto = h.Adapt<HomeworkDto>();
            dto.QuizSetTitle = quizSets.GetValueOrDefault(h.QuizSetId);
            dto.SubmissionCount = h.Submissions.Count;
            dto.IsOverdue = h.IsOverdue;
            return dto;
        }).ToList();

        return new HomeworkResponseDto
        {
            Data = dtos,
            Total = total,
            Page = request.Page,
            PageSize = request.PageSize,
            TotalPages = totalPages
        };
    }
}
