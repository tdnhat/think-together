using Application.DTOs;
using MediatR;

namespace Application.Handlers.User.Commands.LoginUser;

public sealed record LoginUserCommand(
    string Email,
    string Password) : IRequest<AuthTokenDto>;
