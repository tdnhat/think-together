using Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using ThinkTogether.Domain.Aggregates.UserAggregate;
using ThinkTogether.Domain.Aggregates.UserAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.UserAggregate.Specifications;

namespace ThinkTogether.Infrastructure.Persistence.Repositories;

public class UserRepository : Repository<User, Guid>, IUserRepository
{
    public UserRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<List<User>> GetByIdsAsync(List<Guid> ids, CancellationToken cancellationToken = default)
    {
        if (ids == null || ids.Count == 0)
        {
            return new List<User>();
        }

        return await _dbSet
            .Where(u => ids.Contains(u.Id) && u.DeletedAt == null)
            .ToListAsync(cancellationToken);
    }
}
