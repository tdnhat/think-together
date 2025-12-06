using Shared.Primitives;
using ThinkTogether.Domain.Enums;

namespace ThinkTogether.Domain.Aggregates.GamingAggregate.Specifications;

public sealed class ActiveGameSessionByHostSpec : Specification<GameSession>
{
    public ActiveGameSessionByHostSpec(Guid hostUserId)
    {
        Criteria = _ => _.HostUserId == hostUserId && _.Status != GameStatus.Ended;
        
        AddInclude(_ => _.Players);
    }
}

