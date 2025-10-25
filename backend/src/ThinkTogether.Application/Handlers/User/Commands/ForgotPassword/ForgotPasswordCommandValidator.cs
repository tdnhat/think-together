using FluentValidation;
using ThinkTogether.Application.Handlers.User.Commands.ForgotPassword;

namespace Application.Handlers.User.Commands.ForgotPassword;

public sealed class ForgotPasswordCommandValidator : AbstractValidator<ForgotPasswordCommand>
{
    public ForgotPasswordCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .WithMessage("Email là bắt buộc")
            .EmailAddress()
            .WithMessage("Email phải hợp lệ");
    }
}
