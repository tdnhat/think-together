using FluentValidation;

namespace ThinkTogether.Application.Handlers.User.Commands.DeactivateUser;

public class DeactivateUserCommandValidator : AbstractValidator<DeactivateUserCommand>
{
    public DeactivateUserCommandValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
    }
}
