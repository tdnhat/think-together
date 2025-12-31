using FluentValidation;

namespace ThinkTogether.Application.Handlers.Challenge.Commands.SubmitAnswers;

public sealed class SubmitAnswersCommandValidator : AbstractValidator<SubmitAnswersCommand>
{
    public SubmitAnswersCommandValidator()
    {
        RuleFor(x => x.AttemptId)
            .NotEmpty().WithMessage("ID lượt chơi không được để trống");

        RuleFor(x => x.Answers)
            .NotNull().WithMessage("Danh sách câu trả lời không được để trống");

        RuleForEach(x => x.Answers).ChildRules(a =>
        {
            a.RuleFor(x => x.QuestionId).NotEmpty().WithMessage("ID câu hỏi không được để trống");
        });
    }
}
