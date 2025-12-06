using ThinkTogether.Domain.Aggregates.GamingAggregate;
using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.GamingAggregate.Repositories;

public interface IGameSessionRepository : IRepository<GameSession, Guid>
{
}
