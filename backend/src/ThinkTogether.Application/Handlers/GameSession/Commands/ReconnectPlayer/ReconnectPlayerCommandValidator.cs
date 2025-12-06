using FluentValidation;

namespace ThinkTogether.Application.Handlers.GameSession.Commands.ReconnectPlayer;

public sealed class ReconnectPlayerCommandValidator : AbstractValidator<ReconnectPlayerCommand>
{
    public ReconnectPlayerCommandValidator()
    {
        RuleFor(x => x.Pin)
            .NotEmpty()
            .WithMessage("Mã PIN là bắt buộc")
            .Length(6)
            .WithMessage("Mã PIN phải có 6 chữ số");

        RuleFor(x => x.PlayerId)
            .NotEmpty()
            .WithMessage("ID người chơi là bắt buộc");
    }
}

