using Infrastructure.Persistence.Repositories;
using ThinkTogether.Domain.Aggregates.GamingAggregate;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Repositories;

namespace ThinkTogether.Infrastructure.Persistence.Repositories;

public class GameSessionRepository : Repository<GameSession, Guid>, IGameSessionRepository
{
    public GameSessionRepository(ApplicationDbContext context) : base(context)
    {
    }
}
