using FluentValidation;

namespace ThinkTogether.Application.Handlers.QuizSet.Commands.ReorderQuestions;

public sealed class ReorderQuestionsCommandValidator : AbstractValidator<ReorderQuestionsCommand>
{
    public ReorderQuestionsCommandValidator()
    {
        RuleFor(x => x.QuizSetId)
            .NotEmpty().WithMessage("ID bộ câu hỏi không được để trống");

        RuleFor(x => x.Questions)
            .NotEmpty().WithMessage("Danh sách câu hỏi không được để trống");

        RuleForEach(x => x.Questions).ChildRules(q =>
        {
            q.RuleFor(x => x.QuestionId).NotEmpty().WithMessage("ID câu hỏi không được để trống");
            q.RuleFor(x => x.DisplayOrder).GreaterThanOrEqualTo(0).WithMessage("Thứ tự hiển thị không được âm");
        });
    }
}
