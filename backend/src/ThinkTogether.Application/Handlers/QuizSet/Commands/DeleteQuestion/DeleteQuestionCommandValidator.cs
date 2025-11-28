using FluentValidation;

namespace ThinkTogether.Application.Handlers.QuizSet.Commands.DeleteQuestion;

public sealed class DeleteQuestionCommandValidator : AbstractValidator<DeleteQuestionCommand>
{
    public DeleteQuestionCommandValidator()
    {
        RuleFor(x => x.QuizSetId)
            .NotEmpty()
            .WithMessage("ID bộ trắc nghiệm là bắt buộc");

        RuleFor(x => x.QuestionId)
            .NotEmpty()
            .WithMessage("ID câu hỏi là bắt buộc");
    }
}

