using MediatR;
using ThinkTogether.Domain.Aggregates.CategoryAggregate;
using ThinkTogether.Domain.Aggregates.CategoryAggregate.Repositories;
using ThinkTogether.Domain.Exceptions;

namespace ThinkTogether.Application.Handlers.Category.Commands.DeleteCategory;

public class DeleteCategoryCommandHandler : IRequestHandler<DeleteCategoryCommand>
{
    private readonly ICategoryRepository _categoryRepository;

    public DeleteCategoryCommandHandler(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task Handle(DeleteCategoryCommand request, CancellationToken cancellationToken)
    {
        // Get existing category
        var category = await _categoryRepository.GetByIdAsync(request.Id, cancellationToken);
        if (category is null)
            throw new EntityNotFoundException(nameof(Category), request.Id);

        // Soft delete
        category.Delete();

        // Save changes
        await _categoryRepository.SaveChangesAsync(cancellationToken);
    }
}

