using MediatR;

namespace ThinkTogether.Application.Handlers.User.Commands.ResendEmailConfirmation;

public sealed record ResendEmailConfirmationCommand(string Email) : IRequest;
