using ThinkTogether.Domain.Aggregates.ChallengeAggregate;
using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.ChallengeAggregate.Repositories;

public interface IChallengeRepository : IRepository<Challenge, Guid>
{
}
