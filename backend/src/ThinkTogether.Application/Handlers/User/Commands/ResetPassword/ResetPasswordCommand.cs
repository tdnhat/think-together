using MediatR;

namespace ThinkTogether.Application.Handlers.User.Commands.ResetPassword;

public sealed record ResetPasswordCommand(
    string Token,
    string NewPassword,
    string ConfirmPassword) : IRequest;
