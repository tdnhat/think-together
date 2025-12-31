using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Entities;

namespace ThinkTogether.Domain.Aggregates.ClassAggregate.Services;

public interface IHomeworkSubmissionService
{
    Task<bool> CreateSubmissionFromAttemptAsync(
        ChallengeAttempt attempt,
        Guid homeworkId,
        int score,
        CancellationToken cancellationToken = default);
}

