using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.User.Commands.UpdateCurrentUserProfile;

public sealed record UpdateCurrentUserProfileCommand(
    string FirstName,
    string LastName,
    string? AvatarUrl,
    string? Bio
) : IRequest<UserDto>;
