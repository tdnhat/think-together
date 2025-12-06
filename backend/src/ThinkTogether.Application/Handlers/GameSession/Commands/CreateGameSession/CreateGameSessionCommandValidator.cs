using FluentValidation;

namespace ThinkTogether.Application.Handlers.GameSession.Commands.CreateGameSession;

public sealed class CreateGameSessionCommandValidator : AbstractValidator<CreateGameSessionCommand>
{
    public CreateGameSessionCommandValidator()
    {
        RuleFor(x => x.QuizSetId)
            .NotEmpty()
            .WithMessage("ID bộ câu hỏi là bắt buộc");
    }
}

