using ThinkTogether.Domain.Aggregates.ChallengeAggregate;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Entities;
using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.ChallengeAggregate.Repositories;

public interface IChallengeRepository : IRepository<Challenge, Guid>
{
    Task<List<(ChallengeAttempt Attempt, Challenge Challenge)>> GetCompletedAttemptsWithChallengesAsync(
        Guid? quizSetId = null,
        Guid? challengeId = null,
        DateTime? completedAfter = null,
        CancellationToken cancellationToken = default);
    
    Task<List<ChallengeAttempt>> GetAttemptsWithChallengesAsync(
        Guid? quizSetId = null,
        Guid? challengeId = null,
        DateTime? startedAfter = null,
        CancellationToken cancellationToken = default);
    
    Task<int> CountAttemptsAsync(CancellationToken cancellationToken = default);
}
