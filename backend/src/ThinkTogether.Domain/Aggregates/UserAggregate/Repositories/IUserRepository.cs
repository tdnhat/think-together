using ThinkTogether.Domain.Aggregates.UserAggregate;
using ThinkTogether.Domain.Aggregates.UserAggregate.ValueObjects;
using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.UserAggregate.Repositories;

public interface IUserRepository : IRepository<User, Guid>
{
}
