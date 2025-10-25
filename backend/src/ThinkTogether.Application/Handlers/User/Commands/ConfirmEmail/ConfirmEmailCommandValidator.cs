using FluentValidation;

namespace ThinkTogether.Application.Handlers.User.Commands.ConfirmEmail;

public sealed class ConfirmEmailCommandValidator : AbstractValidator<ConfirmEmailCommand>
{
    public ConfirmEmailCommandValidator()
    {
        RuleFor(x => x.Token)
            .NotEmpty()
            .WithMessage("Token xác nhận email là bắt buộc");
    }
}
