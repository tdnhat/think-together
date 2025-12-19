using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Domain.Aggregates.CategoryAggregate;
using ThinkTogether.Domain.Aggregates.CategoryAggregate.Repositories;
using ThinkTogether.Domain.Exceptions;
using Mapster;

namespace ThinkTogether.Application.Handlers.Category.Queries.GetCategoryById;

public class GetCategoryByIdQueryHandler : IRequestHandler<GetCategoryByIdQuery, CategoryDto>
{
    private readonly ICategoryRepository _categoryRepository;

    public GetCategoryByIdQueryHandler(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<CategoryDto> Handle(GetCategoryByIdQuery request, CancellationToken cancellationToken)
    {
        var category = await _categoryRepository.GetByIdAsync(request.Id, cancellationToken);
        
        if (category is null)
            throw new EntityNotFoundException(nameof(Category), request.Id);

        return category.Adapt<CategoryDto>();
    }
}

