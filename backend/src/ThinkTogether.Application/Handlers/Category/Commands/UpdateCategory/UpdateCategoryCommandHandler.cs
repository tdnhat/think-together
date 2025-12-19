using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Domain.Aggregates.CategoryAggregate;
using ThinkTogether.Domain.Aggregates.CategoryAggregate.Repositories;
using ThinkTogether.Domain.Exceptions;
using Mapster;

namespace ThinkTogether.Application.Handlers.Category.Commands.UpdateCategory;

public class UpdateCategoryCommandHandler : IRequestHandler<UpdateCategoryCommand, CategoryDto>
{
    private readonly ICategoryRepository _categoryRepository;

    public UpdateCategoryCommandHandler(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<CategoryDto> Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
    {
        // Get existing category
        var category = await _categoryRepository.GetByIdAsync(request.Id, cancellationToken);
        if (category is null)
            throw new EntityNotFoundException(nameof(Category), request.Id);

        // Check if name already exists (excluding current ID)
        var exists = await _categoryRepository.ExistsByNameAsync(request.Name, request.Id, cancellationToken);
        if (exists)
            throw new ValidationException("Tên danh mục đã tồn tại");

        // Update category
        category.Update(request.Name, request.Description, request.DisplayOrder);
        category.SetActive(request.IsActive);

        // Save changes
        await _categoryRepository.SaveChangesAsync(cancellationToken);

        // Return DTO
        return category.Adapt<CategoryDto>();
    }
}

