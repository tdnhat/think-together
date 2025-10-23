using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.User.Commands.LoginUser;

public sealed record LoginUserCommand(
    string Email,
    string Password,
    bool RememberMe = false) : IRequest<AuthTokenDto>;
