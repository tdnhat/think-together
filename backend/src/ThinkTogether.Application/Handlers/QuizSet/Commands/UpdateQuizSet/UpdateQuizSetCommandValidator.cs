using FluentValidation;

namespace ThinkTogether.Application.Handlers.QuizSet.Commands.UpdateQuizSet;

public sealed class UpdateQuizSetCommandValidator : AbstractValidator<UpdateQuizSetCommand>
{
    public UpdateQuizSetCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Id is required");

        RuleFor(x => x.Title)
            .MaximumLength(255).WithMessage("Title cannot exceed 255 characters")
            .When(x => x.Title != null);

        RuleFor(x => x.Description)
            .MaximumLength(1000).WithMessage("Description cannot exceed 1000 characters")
            .When(x => x.Description != null);

        RuleFor(x => x.CoverImageUrl)
            .MaximumLength(500).WithMessage("Cover image URL cannot exceed 500 characters")
            .When(x => x.CoverImageUrl != null);
    }
}
