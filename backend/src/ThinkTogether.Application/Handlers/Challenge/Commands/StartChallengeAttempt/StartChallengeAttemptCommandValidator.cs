using FluentValidation;

namespace ThinkTogether.Application.Handlers.Challenge.Commands.StartChallengeAttempt;

public sealed class StartChallengeAttemptCommandValidator : AbstractValidator<StartChallengeAttemptCommand>
{
    public StartChallengeAttemptCommandValidator()
    {
        RuleFor(x => x.ChallengeId)
            .NotEmpty().WithMessage("ID thử thách không được trống");

        RuleFor(x => x.Nickname)
            .NotEmpty().WithMessage("Biệt danh không được trống")
            .MaximumLength(100).WithMessage("Biệt danh không được vượt quá 100 ký tự");
    }
}
