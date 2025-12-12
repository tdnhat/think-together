using Shared.Primitives;
using ThinkTogether.Domain.Enums;

namespace ThinkTogether.Domain.Aggregates.GamingAggregate.Specifications;

public sealed class GameSessionByPinSpec : Specification<GameSession>
{
    public GameSessionByPinSpec(string pin)
    {
        Criteria = _ => _.PIN == pin && _.Status != GameStatus.Ended;
        
        AddInclude(_ => _.PlayerAnswers);
        AddInclude(_ => _.GameQuestions);
        AddInclude(_ => _.Scores);
        AddInclude(_ => _.PlayerAnswers);
    }
}

