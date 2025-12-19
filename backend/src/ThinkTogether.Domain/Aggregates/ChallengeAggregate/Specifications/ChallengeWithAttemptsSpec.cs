using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.ChallengeAggregate.Specifications;

public class ChallengeWithAttemptsSpec : Specification<Challenge>
{
    public ChallengeWithAttemptsSpec()
    {
        Criteria = challenge => challenge.DeletedAt == null;
        
        // Include Attempts
        AddInclude("Attempts");
    }
}
