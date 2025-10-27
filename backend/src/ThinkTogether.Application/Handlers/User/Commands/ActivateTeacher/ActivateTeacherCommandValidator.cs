using FluentValidation;

namespace ThinkTogether.Application.Handlers.User.Commands.ActivateTeacher;

public sealed class ActivateTeacherCommandValidator : AbstractValidator<ActivateTeacherCommand>
{
    public ActivateTeacherCommandValidator()
    {
    }
}
