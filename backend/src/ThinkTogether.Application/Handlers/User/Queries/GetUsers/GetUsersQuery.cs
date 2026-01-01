using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Domain.Enums;
using ThinkTogether.Shared.Common;

namespace ThinkTogether.Application.Handlers.User.Queries.GetUsers;

public sealed record GetUsersQuery : IRequest<PaginatedResponse<UserDto>>
{
    public string? Search { get; init; }
    public RoleType? Role { get; init; }
    public string? SortBy { get; init; } // newest, oldes, name, email
    public int Page { get; init; } = 1;
    public int PageSize { get; init; } = 10;
}
