using FluentValidation;

namespace ThinkTogether.Application.Handlers.User.Commands.ActivateCreator;

public sealed class ActivateCreatorCommandValidator : AbstractValidator<ActivateCreatorCommand>
{
    public ActivateCreatorCommandValidator()
    {
    }
}
