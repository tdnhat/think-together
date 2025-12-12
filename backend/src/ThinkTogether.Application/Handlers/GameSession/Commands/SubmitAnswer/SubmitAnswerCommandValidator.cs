using FluentValidation;

namespace ThinkTogether.Application.Handlers.GameSession.Commands.SubmitAnswer;

public sealed class SubmitAnswerCommandValidator : AbstractValidator<SubmitAnswerCommand>
{
    public SubmitAnswerCommandValidator()
    {
        RuleFor(x => x.GameSessionId)
            .NotEmpty()
            .WithMessage("ID phiên trò chơi là bắt buộc");

        RuleFor(x => x.PlayerId)
            .NotEmpty()
            .WithMessage("ID người chơi là bắt buộc");

        RuleFor(x => x.GameQuestionId)
            .NotEmpty()
            .WithMessage("ID câu hỏi là bắt buộc");

        RuleFor(x => x.SelectedOptionIndexes)
            .NotNull()
            .WithMessage("Câu trả lời không được null");

        RuleFor(x => x.ResponseTimeMs)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Thời gian phản hồi không được âm");
    }
}

