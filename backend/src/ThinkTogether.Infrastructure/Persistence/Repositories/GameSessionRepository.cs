using Domain.Aggregates.GameSessionAggregate;
using Domain.Aggregates.GameSessionAggregate.Repositories;
using Domain.Aggregates.GameSessionAggregate.ValueObjects;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories;

public class GameSessionRepository : Repository<GameSession, Guid>, IGameSessionRepository
{
    public GameSessionRepository(ApplicationDbContext context) : base(context)
    {
    }

    public override async Task<GameSession?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .AsNoTracking()
            .FirstOrDefaultAsync(g => g.Id == id && g.DeletedAt == null, cancellationToken);
    }

    public async Task<IEnumerable<GameSession>> GetByHostIdAsync(Guid hostId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(g => g.HostId == hostId && g.DeletedAt == null)
            .OrderByDescending(g => g.CreatedAt)
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    public async Task<GameSession?> GetByPinAsync(GamePin pin, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .AsNoTracking()
            .FirstOrDefaultAsync(g => g.PIN == pin && g.DeletedAt == null, cancellationToken);
    }
}
