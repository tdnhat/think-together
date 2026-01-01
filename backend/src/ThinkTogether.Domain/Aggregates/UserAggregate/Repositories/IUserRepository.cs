using ThinkTogether.Domain.Aggregates.UserAggregate;
using ThinkTogether.Domain.Aggregates.UserAggregate.ValueObjects;
using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.UserAggregate.Repositories;

public interface IUserRepository : IRepository<User, Guid>
{
    Task<List<User>> GetByIdsAsync(List<Guid> ids, CancellationToken cancellationToken = default);

    Task<(List<User> Items, int TotalCount)> GetBySpecificationAsync(Specification<User> spec, CancellationToken cancellationToken = default);

    Task<int> CountAsync(CancellationToken cancellationToken = default);

    Task<int> CountCreatedAfterAsync(DateTime date, CancellationToken cancellationToken = default);

    Task<Dictionary<DateTime, int>> GetCreationStatsAsync(DateTime from, DateTime to, CancellationToken cancellationToken = default);
}
