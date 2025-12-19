using FluentValidation;

namespace ThinkTogether.Application.Handlers.Category.Commands.DeleteCategory;

public class DeleteCategoryCommandValidator : AbstractValidator<DeleteCategoryCommand>
{
    public DeleteCategoryCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("ID danh mục không được trống");
    }
}

