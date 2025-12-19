using FluentValidation;

namespace ThinkTogether.Application.Handlers.Challenge.Commands.StartChallengeAttempt;

public sealed class StartChallengeAttemptCommandValidator : AbstractValidator<StartChallengeAttemptCommand>
{
    public StartChallengeAttemptCommandValidator()
    {
        RuleFor(x => x.ChallengeId)
            .NotEmpty().WithMessage("ID thử thách không được trống");

        // Nickname is required if UserId is not provided (anonymous user)
        RuleFor(x => x.Nickname)
            .NotEmpty()
            .When(x => !x.UserId.HasValue)
            .WithMessage("Biệt danh không được trống")
            .MaximumLength(100).WithMessage("Biệt danh không được vượt quá 100 ký tự");
    }
}
