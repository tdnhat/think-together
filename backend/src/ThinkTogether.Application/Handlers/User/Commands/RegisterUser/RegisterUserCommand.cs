using Application.DTOs;
using MediatR;

namespace Application.Handlers.User.Commands.RegisterUser;

public sealed record RegisterUserCommand(
    string Email,
    string Password,
    string ConfirmPassword,
    string FirstName,
    string LastName) : IRequest<AuthTokenDto>;
