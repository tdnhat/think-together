using FluentValidation;

namespace ThinkTogether.Application.Handlers.QuizSet.Commands.DeleteQuizSet;

public sealed class DeleteQuizSetCommandValidator : AbstractValidator<DeleteQuizSetCommand>
{
    public DeleteQuizSetCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Id is required");
    }
}
