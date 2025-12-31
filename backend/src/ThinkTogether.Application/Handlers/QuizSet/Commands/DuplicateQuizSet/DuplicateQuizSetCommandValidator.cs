using FluentValidation;

namespace ThinkTogether.Application.Handlers.QuizSet.Commands.DuplicateQuizSet;

public sealed class DuplicateQuizSetCommandValidator : AbstractValidator<DuplicateQuizSetCommand>
{
    public DuplicateQuizSetCommandValidator()
    {
        RuleFor(x => x.QuizSetId)
            .NotEmpty().WithMessage("ID bộ câu hỏi không được để trống");
    }
}
