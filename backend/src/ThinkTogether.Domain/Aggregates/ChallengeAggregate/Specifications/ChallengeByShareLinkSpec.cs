using Shared.Primitives;
using ThinkTogether.Domain.Aggregates.GamingAggregate;
using ThinkTogether.Domain.Enums;

namespace ThinkTogether.Domain.Aggregates.ChallengeAggregate.Specifications;

public class ChallengeByShareLinkSpec : Specification<Challenge>
{
    public ChallengeByShareLinkSpec(string shareLink)
    {
        Criteria = challenge => challenge.ShareLink == shareLink;
    }
}