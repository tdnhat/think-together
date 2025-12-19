using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.Category.Queries.SearchCategories;

public class SearchCategoriesQuery : IRequest<IEnumerable<CategoryDto>>
{
    public string SearchTerm { get; set; } = string.Empty;
}

