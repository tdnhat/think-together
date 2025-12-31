using FluentValidation;

namespace ThinkTogether.Application.Handlers.Class.Commands.CreateClass;

public sealed class CreateClassCommandValidator : AbstractValidator<CreateClassCommand>
{
    public CreateClassCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Tên lớp không được để trống")
            .MaximumLength(100).WithMessage("Tên lớp không được vượt quá 100 ký tự");

        RuleFor(x => x.Description)
            .MaximumLength(500).WithMessage("Mô tả không được vượt quá 500 ký tự");
            
        RuleFor(x => x.CoverImageUrl)
            .MaximumLength(500).WithMessage("URL ảnh bìa không được vượt quá 500 ký tự");
    }
}
