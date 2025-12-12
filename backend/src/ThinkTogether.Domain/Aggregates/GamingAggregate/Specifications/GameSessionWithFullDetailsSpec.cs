using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.GamingAggregate.Specifications;

public sealed class GameSessionWithFullDetailsSpec : Specification<GameSession>
{
    public GameSessionWithFullDetailsSpec(Guid sessionId)
    {
        Criteria = _ => _.Id == sessionId;
        
        AddInclude(_ => _.Players);
        AddInclude(_ => _.GameQuestions);
        AddInclude(_ => _.Scores);
        AddInclude(_ => _.PlayerAnswers);
    }
}

