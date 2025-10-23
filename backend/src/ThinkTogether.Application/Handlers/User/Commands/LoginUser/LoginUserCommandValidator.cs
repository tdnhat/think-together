using FluentValidation;

namespace Application.Handlers.User.Commands.LoginUser;

public sealed class LoginUserCommandValidator : AbstractValidator<LoginUserCommand>
{
    public LoginUserCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .WithMessage("Email là bắt buộc")
            .EmailAddress()
            .WithMessage("Email phải hợp lệ");

        RuleFor(x => x.Password)
            .NotEmpty()
            .WithMessage("Mật khẩu là bắt buộc");
    }
}
