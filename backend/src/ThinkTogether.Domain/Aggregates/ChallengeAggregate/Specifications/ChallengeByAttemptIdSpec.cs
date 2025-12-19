using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.ChallengeAggregate.Specifications;

public class ChallengeByAttemptIdSpec : Specification<Challenge>
{
    public ChallengeByAttemptIdSpec(Guid attemptId)
    {
        Criteria = challenge => challenge.Attempts.Any(a => a.Id == attemptId);

        // Include Attempts and their nested entities
        AddInclude("Attempts.Answers");
        AddInclude("Attempts.FlaggedQuestions");
    }
}

