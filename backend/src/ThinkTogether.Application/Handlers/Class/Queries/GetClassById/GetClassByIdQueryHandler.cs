using Mapster;
using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.ClassAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.UserAggregate.Repositories;
using ThinkTogether.Domain.Exceptions;
using ThinkTogether.Shared.Common;

namespace ThinkTogether.Application.Handlers.Class.Queries.GetClassById;

public sealed class GetClassByIdQueryHandler : IRequestHandler<GetClassByIdQuery, ClassDetailDto>
{
    private readonly IClassRepository _classRepository;
    private readonly IUserRepository _userRepository;
    private readonly IQuizSetRepository _quizSetRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetClassByIdQueryHandler(
        IClassRepository classRepository,
        IUserRepository userRepository,
        IQuizSetRepository quizSetRepository,
        ICurrentUserService currentUserService)
    {
        _classRepository = classRepository;
        _userRepository = userRepository;
        _quizSetRepository = quizSetRepository;
        _currentUserService = currentUserService;
    }

    public async Task<ClassDetailDto> Handle(
        GetClassByIdQuery request,
        CancellationToken cancellationToken)
    {
        var classEntity = await _classRepository.GetByIdAsync(request.ClassId, cancellationToken);
        if (classEntity == null)
        {
            throw new EntityNotFoundException(nameof(Class), request.ClassId);
        }

        var dto = classEntity.Adapt<ClassDetailDto>();
        dto.MemberCount = classEntity.Members.Count(m => m.LeftAt == null);
        dto.HomeworkCount = classEntity.Homeworks.Count(h => h.DeletedAt == null);

        // Load teacher info
        var teacher = await _userRepository.GetByIdAsync(classEntity.TeacherId, cancellationToken);
        if (teacher != null)
        {
            dto.TeacherName = teacher.GetFullName();
        }

        // Load member user info in batch
        var memberUserIds = classEntity.Members
            .Where(m => m.LeftAt == null)
            .Select(m => m.UserId)
            .Distinct()
            .ToList();

        var memberUsersList = await _userRepository.GetByIdsAsync(memberUserIds, cancellationToken);
        var memberUsers = memberUsersList.ToDictionary(u => u.Id);

        // Map members with user info
        dto.Members = classEntity.Members
            .Where(m => m.LeftAt == null)
            .Select(m =>
            {
                var memberDto = m.Adapt<ClassMemberDto>();
                if (memberUsers.TryGetValue(m.UserId, out var user))
                {
                    memberDto.UserName = user.GetFullName();
                    memberDto.UserEmail = user.Email.Value;
                }
                return memberDto;
            })
            .ToList();

        // Load quiz set info for homeworks in batch
        var quizSetIds = classEntity.Homeworks
            .Where(h => h.DeletedAt == null)
            .Select(h => h.QuizSetId)
            .Distinct()
            .ToList();

        var quizSetsList = await _quizSetRepository.GetByIdsAsync(quizSetIds, cancellationToken);
        var quizSets = quizSetsList.ToDictionary(q => q.Id);

        // Get current user ID if authenticated
        Guid? currentUserId = null;
        if (_currentUserService.UserId != null && Guid.TryParse(_currentUserService.UserId, out var userId))
        {
            currentUserId = userId;
        }

        // Map homeworks with quiz set info and submission status
        dto.Homeworks = classEntity.Homeworks
            .Where(h => h.DeletedAt == null)
            .Select(h =>
            {
                var homeworkDto = h.Adapt<HomeworkDto>();
                homeworkDto.SubmissionCount = h.Submissions.Count;
                homeworkDto.IsOverdue = h.IsOverdue;
                if (quizSets.TryGetValue(h.QuizSetId, out var quizSet))
                {
                    homeworkDto.QuizSetTitle = quizSet.Title;
                }

                // Check if current user has a submission
                if (currentUserId.HasValue)
                {
                    var userSubmission = h.Submissions.FirstOrDefault(s => s.StudentId == currentUserId.Value);
                    if (userSubmission != null)
                    {
                        homeworkDto.HasSubmission = true;
                        homeworkDto.SubmissionId = userSubmission.Id;
                    }
                    else
                    {
                        homeworkDto.HasSubmission = false;
                    }
                }

                return homeworkDto;
            })
            .OrderByDescending(h => h.AssignedAt)
            .ToList();

        return dto;
    }
}
