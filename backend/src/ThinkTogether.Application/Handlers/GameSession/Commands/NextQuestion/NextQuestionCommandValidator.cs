using FluentValidation;

namespace ThinkTogether.Application.Handlers.GameSession.Commands.NextQuestion;

public sealed class NextQuestionCommandValidator : AbstractValidator<NextQuestionCommand>
{
    public NextQuestionCommandValidator()
    {
        RuleFor(x => x.GameSessionId)
            .NotEmpty()
            .WithMessage("ID phiên trò chơi là bắt buộc");
    }
}

