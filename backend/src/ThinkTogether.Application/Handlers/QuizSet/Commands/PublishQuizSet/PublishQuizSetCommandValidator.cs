using FluentValidation;

namespace ThinkTogether.Application.Handlers.QuizSet.Commands.PublishQuizSet;

public sealed class PublishQuizSetCommandValidator : AbstractValidator<PublishQuizSetCommand>
{
    public PublishQuizSetCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Id is required");
    }
}
