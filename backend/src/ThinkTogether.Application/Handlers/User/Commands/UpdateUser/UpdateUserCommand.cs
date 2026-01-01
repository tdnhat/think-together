using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Domain.Enums;

namespace ThinkTogether.Application.Handlers.User.Commands.UpdateUser;

public record UpdateUserCommand(
    Guid Id,
    string FirstName,
    string LastName,
    RoleType Role,
    string? Bio
) : IRequest<UserDto>;
