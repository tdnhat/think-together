using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Domain.Aggregates.CategoryAggregate;
using ThinkTogether.Domain.Aggregates.CategoryAggregate.Repositories;
using Mapster;

namespace ThinkTogether.Application.Handlers.Category.Queries.SearchCategories;

public class SearchCategoriesQueryHandler : IRequestHandler<SearchCategoriesQuery, IEnumerable<CategoryDto>>
{
    private readonly ICategoryRepository _categoryRepository;

    public SearchCategoriesQueryHandler(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<IEnumerable<CategoryDto>> Handle(SearchCategoriesQuery request, CancellationToken cancellationToken)
    {
        var categories = await _categoryRepository.SearchAsync(request.SearchTerm, cancellationToken);
        return categories.Adapt<IEnumerable<CategoryDto>>();
    }
}

