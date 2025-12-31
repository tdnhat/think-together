using FluentValidation;

namespace ThinkTogether.Application.Handlers.Class.Commands.JoinClass;

public sealed class JoinClassCommandValidator : AbstractValidator<JoinClassCommand>
{
    public JoinClassCommandValidator()
    {
        RuleFor(x => x.JoinCode)
            .NotEmpty().WithMessage("Mã tham gia không được để trống")
            .Length(6, 12).WithMessage("Mã tham gia phải từ 6 đến 12 ký tự");
    }
}
