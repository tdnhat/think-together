using Application.Handlers.User.Commands.ResetPassword;
using FluentValidation;
using ThinkTogether.Application.Handlers.User.Commands.ResetPassword;

namespace Application.Handlers.User.Commands.ResetPassword;

public sealed class ResetPasswordCommandValidator : AbstractValidator<ResetPasswordCommand>
{
    public ResetPasswordCommandValidator()
    {
        RuleFor(x => x.Token)
            .NotEmpty()
            .WithMessage("Token đặt lại mật khẩu là bắt buộc");

        RuleFor(x => x.NewPassword)
            .NotEmpty()
            .WithMessage("Mật khẩu mới là bắt buộc")
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
            .Equal(x => x.NewPassword)
            .WithMessage("Mật khẩu không trùng khớp");
    }
}
