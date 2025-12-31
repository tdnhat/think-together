using Mapster;
using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.ClassAggregate.Entities;
using ThinkTogether.Domain.Aggregates.ClassAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Repositories;
using ThinkTogether.Domain.Exceptions;
using ThinkTogether.Shared.Common;

namespace ThinkTogether.Application.Handlers.Class.Commands.CreateHomework;

public sealed class CreateHomeworkCommandHandler : IRequestHandler<CreateHomeworkCommand, HomeworkDto>
{
    private readonly IClassRepository _classRepository;
    private readonly IQuizSetRepository _quizSetRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IUnitOfWork _unitOfWork;

    public CreateHomeworkCommandHandler(
        IClassRepository classRepository,
        IQuizSetRepository quizSetRepository,
        ICurrentUserService currentUserService,
        IUnitOfWork unitOfWork)
    {
        _classRepository = classRepository;
        _quizSetRepository = quizSetRepository;
        _currentUserService = currentUserService;
        _unitOfWork = unitOfWork;
    }

    public async Task<HomeworkDto> Handle(
        CreateHomeworkCommand request,
        CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(_currentUserService.UserId!);

        var classEntity = await _classRepository.GetByIdAsync(request.ClassId, cancellationToken);
        if (classEntity == null)
        {
            throw new EntityNotFoundException(nameof(Class), request.ClassId);
        }

        if (classEntity.TeacherId != userId)
        {
            throw new ForbiddenException("Chỉ giáo viên mới có thể tạo bài tập về nhà");
        }

        var quizSet = await _quizSetRepository.GetByIdAsync(request.QuizSetId, cancellationToken);
        if (quizSet == null)
        {
            throw new EntityNotFoundException(nameof(QuizSet), request.QuizSetId);
        }

        var homework = Homework.Create(
            request.ClassId,
            request.QuizSetId,
            request.Title,
            request.DueDate);

        classEntity.AddHomework(homework);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var dto = homework.Adapt<HomeworkDto>();
        dto.QuizSetTitle = quizSet.Title;
        dto.SubmissionCount = 0;
        dto.IsOverdue = homework.IsOverdue;

        return dto;
    }
}
