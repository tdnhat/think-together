using FluentValidation;

namespace ThinkTogether.Application.Handlers.GameSession.Commands.EndGame;

public sealed class EndGameCommandValidator : AbstractValidator<EndGameCommand>
{
    public EndGameCommandValidator()
    {
        RuleFor(x => x.GameSessionId)
            .NotEmpty()
            .WithMessage("ID phiên trò chơi là bắt buộc");
    }
}

