using MediatR;

namespace ThinkTogether.Application.Handlers.User.Commands.ConfirmEmail;

public sealed record ConfirmEmailCommand(string Token) : IRequest;
