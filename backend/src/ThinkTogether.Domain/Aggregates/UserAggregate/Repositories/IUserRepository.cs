using ThinkTogether.Domain.Aggregates.UserAggregate;
using ThinkTogether.Domain.Aggregates.UserAggregate.ValueObjects;
using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.UserAggregate.Repositories;

public interface IUserRepository : IRepository<User, Guid>
{
    Task<List<User>> GetByIdsAsync(List<Guid> ids, CancellationToken cancellationToken = default);
}
