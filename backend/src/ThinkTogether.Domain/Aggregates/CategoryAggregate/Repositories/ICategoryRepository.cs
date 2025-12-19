using Shared.Primitives;
using ThinkTogether.Shared.Common;

namespace ThinkTogether.Domain.Aggregates.CategoryAggregate.Repositories;

public interface ICategoryRepository : IRepository<Category, Guid>
{
    /// <summary>
    /// Get all active categories
    /// </summary>
    Task<IEnumerable<Category>> GetAllActiveAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Get category by ID (including soft-deleted)
    /// </summary>
    new Task<Category?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Check if category name already exists (excluding current ID)
    /// </summary>
    Task<bool> ExistsByNameAsync(string name, Guid? excludeId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Search categories by name
    /// </summary>
    Task<IEnumerable<Category>> SearchAsync(string searchTerm, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get paginated categories
    /// </summary>
    Task<PaginatedResponse<Category>> GetPaginatedAsync(
        int page,
        int pageSize,
        CancellationToken cancellationToken = default);
}

