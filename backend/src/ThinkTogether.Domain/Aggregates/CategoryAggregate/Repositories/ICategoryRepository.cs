using Shared.Primitives;
using ThinkTogether.Shared.Common;

namespace ThinkTogether.Domain.Aggregates.CategoryAggregate.Repositories;

public interface ICategoryRepository : IRepository<Category, Guid>
{
    Task<IEnumerable<Category>> GetAllActiveAsync(CancellationToken cancellationToken = default);

    new Task<Category?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    Task<bool> ExistsByNameAsync(string name, Guid? excludeId = null, CancellationToken cancellationToken = default);

    Task<IEnumerable<Category>> SearchAsync(string searchTerm, CancellationToken cancellationToken = default);

    Task<PaginatedResponse<Category>> GetPaginatedAsync(
        int page,
        int pageSize,
        CancellationToken cancellationToken = default);
}

