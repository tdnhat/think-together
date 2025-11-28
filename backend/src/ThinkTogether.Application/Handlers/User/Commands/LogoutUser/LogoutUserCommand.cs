using MediatR;

namespace ThinkTogether.Application.Handlers.User.Commands.LogoutUser;

public sealed record LogoutUserCommand(string RefreshToken) : IRequest;
