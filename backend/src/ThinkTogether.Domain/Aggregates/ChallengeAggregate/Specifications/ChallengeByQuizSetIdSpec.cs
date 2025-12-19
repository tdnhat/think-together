using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.ChallengeAggregate.Specifications;

public class ChallengeByQuizSetIdSpec : Specification<Challenge>
{
    public ChallengeByQuizSetIdSpec(Guid quizSetId)
    {
        Criteria = challenge => challenge.QuizSetId == quizSetId && challenge.DeletedAt == null;
    }
}

