using Mapster;
using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Domain.Aggregates.ClassAggregate.Repositories;
using ThinkTogether.Domain.Exceptions;

namespace ThinkTogether.Application.Handlers.Class.Queries.GetClassById;

public sealed class GetClassByIdQueryHandler : IRequestHandler<GetClassByIdQuery, ClassDetailDto>
{
    private readonly IClassRepository _classRepository;

    public GetClassByIdQueryHandler(IClassRepository classRepository)
    {
        _classRepository = classRepository;
    }

    public async Task<ClassDetailDto> Handle(
        GetClassByIdQuery request,
        CancellationToken cancellationToken)
    {
        var classEntity = await _classRepository.GetByIdAsync(request.ClassId, cancellationToken);
        if (classEntity == null)
        {
            throw new EntityNotFoundException("Class", request.ClassId);
        }

        var dto = classEntity.Adapt<ClassDetailDto>();
        dto.MemberCount = classEntity.Members.Count(m => m.LeftAt == null);
        dto.HomeworkCount = classEntity.Homeworks.Count;

        // Map members
        dto.Members = classEntity.Members
            .Where(m => m.LeftAt == null)
            .Select(m => m.Adapt<ClassMemberDto>())
            .ToList();

        // Map homeworks
        dto.Homeworks = classEntity.Homeworks
            .Select(h =>
            {
                var homeworkDto = h.Adapt<HomeworkDto>();
                homeworkDto.SubmissionCount = h.Submissions.Count;
                homeworkDto.IsOverdue = h.IsOverdue;
                return homeworkDto;
            })
            .ToList();

        return dto;
    }
}
