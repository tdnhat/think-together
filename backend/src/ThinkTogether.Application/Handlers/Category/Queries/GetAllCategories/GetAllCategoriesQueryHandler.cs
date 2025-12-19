using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Domain.Aggregates.CategoryAggregate;
using ThinkTogether.Domain.Aggregates.CategoryAggregate.Repositories;
using Mapster;

namespace ThinkTogether.Application.Handlers.Category.Queries.GetAllCategories;

public class GetAllCategoriesQueryHandler : IRequestHandler<GetAllCategoriesQuery, IEnumerable<CategoryDto>>
{
    private readonly ICategoryRepository _categoryRepository;

    public GetAllCategoriesQueryHandler(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<IEnumerable<CategoryDto>> Handle(GetAllCategoriesQuery request, CancellationToken cancellationToken)
    {
        IEnumerable<Domain.Aggregates.CategoryAggregate.Category> categories;

        if (request.OnlyActive)
        {
            categories = await _categoryRepository.GetAllActiveAsync(cancellationToken);
        }
        else
        {
            categories = await _categoryRepository.GetAllAsync(cancellationToken);
        }

        return categories.Adapt<IEnumerable<CategoryDto>>();
    }
}

