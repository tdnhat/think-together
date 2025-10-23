using FluentValidation;
using ThinkTogether.Application.Handlers.User.Commands.RefreshToken;

namespace Application.Handlers.User.Commands.RefreshToken;

public sealed class RefreshTokenCommandValidator : AbstractValidator<RefreshTokenCommand>
{
    public RefreshTokenCommandValidator()
    {
        RuleFor(x => x.Token)
            .NotEmpty().WithMessage("Refresh token là bắt buộc")
            .MinimumLength(10).WithMessage("Format refresh token không hợp lệ");
    }
}
