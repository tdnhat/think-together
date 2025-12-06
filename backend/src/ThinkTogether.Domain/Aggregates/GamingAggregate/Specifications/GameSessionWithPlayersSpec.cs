using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.GamingAggregate.Specifications;

public sealed class GameSessionWithPlayersSpec : Specification<GameSession>
{
    public GameSessionWithPlayersSpec(Guid sessionId)
    {
        Criteria = _ => _.Id == sessionId;
        
        AddInclude(_ => _.Players);
    }
}

