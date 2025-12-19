using FluentValidation;

namespace ThinkTogether.Application.Handlers.Category.Commands.UpdateCategory;

public class UpdateCategoryCommandValidator : AbstractValidator<UpdateCategoryCommand>
{
    public UpdateCategoryCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("ID danh mục không được trống");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Tên danh mục không được trống")
            .MaximumLength(255).WithMessage("Tên danh mục không được vượt quá 255 ký tự");

        RuleFor(x => x.Description)
            .MaximumLength(2000).WithMessage("Mô tả không được vượt quá 2000 ký tự");

        RuleFor(x => x.DisplayOrder)
            .GreaterThanOrEqualTo(0).WithMessage("Thứ tự hiển thị phải là số không âm");
    }
}

