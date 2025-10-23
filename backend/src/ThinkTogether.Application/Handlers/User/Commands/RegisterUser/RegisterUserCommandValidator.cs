using Application.Handlers.User.Commands.RegisterUser;
using FluentValidation;
using ThinkTogether.Application.Handlers.User.Commands.RegisterUser;

namespace Application.Handlers.User.Commands.RegisterUser;

public sealed class RegisterUserCommandValidator : AbstractValidator<RegisterUserCommand>
{
    public RegisterUserCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .WithMessage("Email là bắt buộc")
            .EmailAddress()
            .WithMessage("Email phải hợp lệ");

        RuleFor(x => x.Password)
            .NotEmpty()
            .WithMessage("Mật khẩu là bắt buộc")
            .MinimumLength(8)
            .WithMessage("Mật khẩu phải có ít nhất 8 ký tự")
            .Matches(@"[A-Z]")
            .WithMessage("Mật khẩu phải chứa ít nhất một chữ cái viết hoa")
            .Matches(@"[a-z]")
            .WithMessage("Mật khẩu phải chứa ít nhất một chữ cái viết thường")
            .Matches(@"[0-9]")
            .WithMessage("Mật khẩu phải chứa ít nhất một chữ số");

        RuleFor(x => x.ConfirmPassword)
            .NotEmpty()
            .WithMessage("Xác nhận mật khẩu là bắt buộc")
            .Equal(x => x.Password)
            .WithMessage("Mật khẩu không trùng khớp");

        RuleFor(x => x.FirstName)
            .NotEmpty()
            .WithMessage("Tên là bắt buộc")
            .MaximumLength(100)
            .WithMessage("Tên không được vượt quá 100 ký tự");

        RuleFor(x => x.LastName)
            .NotEmpty()
            .WithMessage("Họ là bắt buộc")
            .MaximumLength(100)
            .WithMessage("Họ không được vượt quá 100 ký tự");
    }
}
