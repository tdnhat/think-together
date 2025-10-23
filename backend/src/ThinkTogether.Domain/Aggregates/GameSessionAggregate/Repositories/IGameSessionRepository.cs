using Domain.Aggregates.GameSessionAggregate.ValueObjects;
using Shared.Primitives;

namespace Domain.Aggregates.GameSessionAggregate.Repositories;

public interface IGameSessionRepository : IRepository<GameSession, Guid>
{
    Task<GameSession?> GetByPinAsync(GamePin pin, CancellationToken cancellationToken = default);
}

