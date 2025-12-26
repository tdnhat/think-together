using Mapster;
using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.ClassAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.UserAggregate.Repositories;
using ThinkTogether.Shared.Common;

namespace ThinkTogether.Application.Handlers.Class.Commands.CreateClass;

public sealed class CreateClassCommandHandler : IRequestHandler<CreateClassCommand, ClassDto>
{
    private readonly IClassRepository _classRepository;
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IUnitOfWork _unitOfWork;

    public CreateClassCommandHandler(
        IClassRepository classRepository,
        IUserRepository userRepository,
        ICurrentUserService currentUserService,
        IUnitOfWork unitOfWork)
    {
        _classRepository = classRepository;
        _userRepository = userRepository;
        _currentUserService = currentUserService;
        _unitOfWork = unitOfWork;
    }

    public async Task<ClassDto> Handle(
        CreateClassCommand request,
        CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(_currentUserService.UserId!);

        var classEntity = Domain.Aggregates.ClassAggregate.Class.Create(
            userId,
            request.Name,
            request.Description);

        if (!string.IsNullOrEmpty(request.CoverImageUrl))
        {
            classEntity.UpdateCoverImageUrl(request.CoverImageUrl);
        }

        await _classRepository.AddAsync(classEntity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var teacher = await _userRepository.GetByIdAsync(userId, cancellationToken);

        var dto = classEntity.Adapt<ClassDto>();
        dto.TeacherName = teacher != null ? $"{teacher.FirstName} {teacher.LastName}".Trim() : "Unknown Teacher";
        dto.MemberCount = 0;
        dto.HomeworkCount = 0;

        return dto;
    }
}
