using FluentValidation;

namespace ThinkTogether.Application.Handlers.Class.Commands.CreateHomework;

public sealed class CreateHomeworkCommandValidator : AbstractValidator<CreateHomeworkCommand>
{
    public CreateHomeworkCommandValidator()
    {
        RuleFor(x => x.ClassId)
            .NotEmpty().WithMessage("ID lớp không được để trống");

        RuleFor(x => x.QuizSetId)
            .NotEmpty().WithMessage("ID bộ câu hỏi không được để trống");

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Tiêu đề bài tập không được để trống")
            .MaximumLength(255).WithMessage("Tiêu đề bài tập không được vượt quá 255 ký tự");

        RuleFor(x => x.DueDate)
            .Must(BeInFuture).When(x => x.DueDate.HasValue)
            .WithMessage("Hạn nộp bài phải ở thời điểm tương lai");
    }

    private bool BeInFuture(DateTime? date)
    {
        return !date.HasValue || date.Value > DateTime.UtcNow;
    }
}
