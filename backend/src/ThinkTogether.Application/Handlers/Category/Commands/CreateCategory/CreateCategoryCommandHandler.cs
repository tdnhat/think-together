using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Domain.Aggregates.CategoryAggregate;
using ThinkTogether.Domain.Aggregates.CategoryAggregate.Repositories;
using ThinkTogether.Domain.Exceptions;
using ThinkTogether.Shared.Common;
using Mapster;

namespace ThinkTogether.Application.Handlers.Category.Commands.CreateCategory;

public class CreateCategoryCommandHandler : IRequestHandler<CreateCategoryCommand, CategoryDto>
{
    private readonly ICategoryRepository _categoryRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateCategoryCommandHandler(ICategoryRepository categoryRepository, IUnitOfWork unitOfWork)
    {
        _categoryRepository = categoryRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<CategoryDto> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
    {
        // Check if name already exists
        var exists = await _categoryRepository.ExistsByNameAsync(request.Name, cancellationToken: cancellationToken);
        if (exists)
            throw new ValidationException("Tên danh mục đã tồn tại");

        // Create category
        var category = ThinkTogether.Domain.Aggregates.CategoryAggregate.Category.Create(request.Name, request.Description);

        // Add to repository
        await _categoryRepository.AddAsync(category, cancellationToken);

        // Save changes
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // Return DTO
        return category.Adapt<CategoryDto>();
    }
}

