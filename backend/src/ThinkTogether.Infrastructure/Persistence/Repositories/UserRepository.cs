using Domain.Aggregates.UserAggregate;
using Domain.Aggregates.UserAggregate.Repositories;
using Domain.Aggregates.UserAggregate.ValueObjects;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories;

public class UserRepository : Repository<User, Guid>, IUserRepository
{
    public UserRepository(ApplicationDbContext context) : base(context)
    {
    }

    public override async Task<User?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == id && u.DeletedAt == null, cancellationToken);
    }

    public async Task<User?> GetByEmailAsync(Email email, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Email == email && u.DeletedAt == null, cancellationToken);
    }
}
