using FluentValidation;

namespace ThinkTogether.Application.Handlers.QuizSet.Commands.CreateQuizSet;

public sealed class CreateQuizSetCommandValidator : AbstractValidator<CreateQuizSetCommand>
{
    public CreateQuizSetCommandValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty()
            .WithMessage("Tiêu đề là bắt buộc")
            .MaximumLength(255)
            .WithMessage("Tiêu đề không được vượt quá 255 ký tự");

        RuleFor(x => x.Description)
            .MaximumLength(2000)
            .WithMessage("Mô tả không được vượt quá 2000 ký tự")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.CoverImageUrl)
            .MaximumLength(500)
            .WithMessage("URL ảnh bìa không được vượt quá 500 ký tự")
            .When(x => !string.IsNullOrEmpty(x.CoverImageUrl));
    }
}

