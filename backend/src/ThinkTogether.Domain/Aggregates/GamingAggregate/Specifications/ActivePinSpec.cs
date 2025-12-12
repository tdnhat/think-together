using Shared.Primitives;
using ThinkTogether.Domain.Enums;

namespace ThinkTogether.Domain.Aggregates.GamingAggregate.Specifications;

public sealed class ActivePinSpec : Specification<GameSession>
{
    public ActivePinSpec(string pin)
    {
        Criteria = _ => _.PIN == pin && _.Status != GameStatus.Ended;
    }
}

