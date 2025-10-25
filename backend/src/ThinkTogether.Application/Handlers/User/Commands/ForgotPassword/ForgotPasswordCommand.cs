using MediatR;

namespace ThinkTogether.Application.Handlers.User.Commands.ForgotPassword;

public sealed record ForgotPasswordCommand(string Email) : IRequest;
