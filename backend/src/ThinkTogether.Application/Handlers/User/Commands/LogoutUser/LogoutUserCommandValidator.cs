using FluentValidation;

namespace ThinkTogether.Application.Handlers.User.Commands.LogoutUser;

public sealed class LogoutUserCommandValidator : AbstractValidator<LogoutUserCommand>
{
    public LogoutUserCommandValidator()
    {
        RuleFor(x => x.RefreshToken)
            .NotEmpty()
            .WithMessage("Refresh token là bắt buộc")
            .MinimumLength(10)
            .WithMessage("Format refresh token không hợp lệ");
    }
}
