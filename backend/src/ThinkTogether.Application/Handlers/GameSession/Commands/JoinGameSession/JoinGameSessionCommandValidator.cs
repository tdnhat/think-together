using FluentValidation;

namespace ThinkTogether.Application.Handlers.GameSession.Commands.JoinGameSession;

public sealed class JoinGameSessionCommandValidator : AbstractValidator<JoinGameSessionCommand>
{
    public JoinGameSessionCommandValidator()
    {
        RuleFor(x => x.Pin)
            .NotEmpty()
            .WithMessage("Mã PIN là bắt buộc")
            .Length(6)
            .WithMessage("Mã PIN phải có 6 chữ số")
            .Matches(@"^\d{6}$")
            .WithMessage("Mã PIN chỉ được chứa chữ số");

        RuleFor(x => x.Nickname)
            .NotEmpty()
            .WithMessage("Nickname là bắt buộc")
            .MinimumLength(2)
            .WithMessage("Nickname phải có ít nhất 2 ký tự")
            .MaximumLength(100)
            .WithMessage("Nickname không được vượt quá 100 ký tự");
    }
}

