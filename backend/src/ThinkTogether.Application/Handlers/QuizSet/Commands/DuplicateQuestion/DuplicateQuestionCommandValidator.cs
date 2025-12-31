using FluentValidation;

namespace ThinkTogether.Application.Handlers.QuizSet.Commands.DuplicateQuestion;

public sealed class DuplicateQuestionCommandValidator : AbstractValidator<DuplicateQuestionCommand>
{
    public DuplicateQuestionCommandValidator()
    {
        RuleFor(x => x.QuizSetId)
            .NotEmpty().WithMessage("ID bộ câu hỏi không được để trống");

        RuleFor(x => x.QuestionId)
            .NotEmpty().WithMessage("ID câu hỏi không được để trống");
    }
}
