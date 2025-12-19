using Mapster;
using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.ClassAggregate.Repositories;

namespace ThinkTogether.Application.Handlers.Class.Queries.GetClasses;

public sealed class GetClassesQueryHandler : IRequestHandler<GetClassesQuery, ClassResponseDto>
{
    private readonly IClassRepository _classRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetClassesQueryHandler(
        IClassRepository classRepository,
        ICurrentUserService currentUserService)
    {
        _classRepository = classRepository;
        _currentUserService = currentUserService;
    }

    public async Task<ClassResponseDto> Handle(
        GetClassesQuery request,
        CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(_currentUserService.UserId!);

        // Get classes where user is teacher or member
        var teacherClasses = await _classRepository.GetByTeacherIdAsync(userId, cancellationToken);
        var memberClasses = await _classRepository.GetByMemberIdAsync(userId, cancellationToken);

        var allClasses = teacherClasses
            .Union(memberClasses)
            .DistinctBy(c => c.Id)
            .ToList();

        // Apply search filter
        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var searchLower = request.Search.ToLowerInvariant();
            allClasses = allClasses
                .Where(c => c.Name.ToLowerInvariant().Contains(searchLower) ||
                           (c.Description != null && c.Description.ToLowerInvariant().Contains(searchLower)))
                .ToList();
        }

        // Pagination
        var total = allClasses.Count;
        var totalPages = (int)Math.Ceiling(total / (double)request.PageSize);
        var pagedClasses = allClasses
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToList();

        var dtos = pagedClasses.Select(c =>
        {
            var dto = c.Adapt<ClassDto>();
            dto.MemberCount = c.Members.Count(m => m.LeftAt == null);
            dto.HomeworkCount = c.Homeworks.Count;
            return dto;
        }).ToList();

        return new ClassResponseDto
        {
            Data = dtos,
            Total = total,
            Page = request.Page,
            PageSize = request.PageSize,
            TotalPages = totalPages
        };
    }
}
