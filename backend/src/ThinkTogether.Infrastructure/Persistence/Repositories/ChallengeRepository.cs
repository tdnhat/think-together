using Domain.Aggregates.ChallengeAggregate;
using Domain.Aggregates.ChallengeAggregate.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories;

public class ChallengeRepository : Repository<Challenge, Guid>, IChallengeRepository
{
    public ChallengeRepository(ApplicationDbContext context) : base(context)
    {
    }

    public override async Task<Challenge?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id && c.DeletedAt == null, cancellationToken);
    }

    public async Task<IEnumerable<Challenge>> GetByCreatorIdAsync(Guid creatorId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(c => c.CreatorId == creatorId && c.DeletedAt == null)
            .OrderByDescending(c => c.UpdatedAt)
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Challenge>> GetActiveAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(c => c.IsActive())
            .OrderByDescending(c => c.CreatedAt)
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }
}
