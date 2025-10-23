using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.User.Commands.RegisterUser;

public sealed record RegisterUserCommand(
    string Email,
    string Password,
    string ConfirmPassword,
    string FirstName,
    string LastName) : IRequest<AuthTokenDto>;
