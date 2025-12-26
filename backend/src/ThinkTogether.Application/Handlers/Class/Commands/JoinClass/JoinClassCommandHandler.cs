using Mapster;
using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.ClassAggregate.Entities;
using ThinkTogether.Domain.Aggregates.ClassAggregate.Repositories;
using ThinkTogether.Domain.Exceptions;
using ThinkTogether.Shared.Common;

namespace ThinkTogether.Application.Handlers.Class.Commands.JoinClass;

public sealed class JoinClassCommandHandler : IRequestHandler<JoinClassCommand, ClassDto>
{
    private readonly IClassRepository _classRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IUnitOfWork _unitOfWork;

    public JoinClassCommandHandler(
        IClassRepository classRepository,
        ICurrentUserService currentUserService,
        IUnitOfWork unitOfWork)
    {
        _classRepository = classRepository;
        _currentUserService = currentUserService;
        _unitOfWork = unitOfWork;
    }

    public async Task<ClassDto> Handle(
        JoinClassCommand request,
        CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(_currentUserService.UserId!);

        var classEntity = await _classRepository.GetByJoinCodeAsync(request.JoinCode, cancellationToken);
        if (classEntity == null)
        {
            throw new EntityNotFoundException("Class", request.JoinCode);
        }

        var member = ClassMember.Create(classEntity.Id, userId);
        classEntity.AddMember(member);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var dto = classEntity.Adapt<ClassDto>();
        dto.MemberCount = classEntity.Members.Count(m => m.LeftAt == null);
        dto.HomeworkCount = classEntity.Homeworks.Count;

        return dto;
    }
}
