using FluentValidation;

namespace ThinkTogether.Application.Handlers.GameSession.Commands.StartGame;

public sealed class StartGameCommandValidator : AbstractValidator<StartGameCommand>
{
    public StartGameCommandValidator()
    {
        RuleFor(x => x.GameSessionId)
            .NotEmpty()
            .WithMessage("ID phiên trò chơi là bắt buộc");
    }
}

