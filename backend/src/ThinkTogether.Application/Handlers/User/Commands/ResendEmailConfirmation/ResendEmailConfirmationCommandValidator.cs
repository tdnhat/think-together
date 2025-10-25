using FluentValidation;

namespace ThinkTogether.Application.Handlers.User.Commands.ResendEmailConfirmation;

public sealed class ResendEmailConfirmationCommandValidator : AbstractValidator<ResendEmailConfirmationCommand>
{
    public ResendEmailConfirmationCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .WithMessage("Email là bắt buộc")
            .EmailAddress()
            .WithMessage("Email phải hợp lệ");
    }
}
