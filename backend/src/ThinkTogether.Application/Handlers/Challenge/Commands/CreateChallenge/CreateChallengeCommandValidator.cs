using FluentValidation;

namespace ThinkTogether.Application.Handlers.Challenge.Commands.CreateChallenge;

public sealed class CreateChallengeCommandValidator : AbstractValidator<CreateChallengeCommand>
{
    public CreateChallengeCommandValidator()
    {
        RuleFor(x => x.QuizSetId)
            .NotEmpty()
            .WithMessage("ID bộ câu hỏi là bắt buộc");

        RuleFor(x => x.Title)
            .NotEmpty()
            .WithMessage("Tiêu đề là bắt buộc")
            .MaximumLength(255)
            .WithMessage("Tiêu đề không được vượt quá 255 ký tự");

        RuleFor(x => x.Description)
            .MaximumLength(2000)
            .WithMessage("Mô tả không được vượt quá 2000 ký tự")
            .When(x => !string.IsNullOrEmpty(x.Description));
    }
}

