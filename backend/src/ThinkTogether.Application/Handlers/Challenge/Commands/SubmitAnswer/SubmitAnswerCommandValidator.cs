using FluentValidation;

namespace ThinkTogether.Application.Handlers.Challenge.Commands.SubmitAnswer;

public sealed class SubmitAnswerCommandValidator : AbstractValidator<SubmitAnswerCommand>
{
    public SubmitAnswerCommandValidator()
    {
        RuleFor(x => x.AttemptId)
            .NotEmpty().WithMessage("ID lượt chơi không được trống");

        RuleFor(x => x.QuestionId)
            .NotEmpty().WithMessage("ID câu hỏi không được trống");
    }
}
