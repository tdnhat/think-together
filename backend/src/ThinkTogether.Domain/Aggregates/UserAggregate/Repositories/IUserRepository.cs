using Domain.Aggregates.UserAggregate.ValueObjects;
using Shared.Primitives;

namespace Domain.Aggregates.UserAggregate.Repositories;

public interface IUserRepository : IRepository<User, Guid>
{
    Task<User?> GetByEmailAsync(Email email, CancellationToken cancellationToken = default);
}

