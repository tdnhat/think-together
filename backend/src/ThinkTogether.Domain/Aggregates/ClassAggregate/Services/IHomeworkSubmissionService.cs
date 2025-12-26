using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Entities;

namespace ThinkTogether.Domain.Aggregates.ClassAggregate.Services;

/// <summary>
/// Service for creating homework submissions from challenge attempts.
/// Handles cross-aggregate operations between Challenge and Class aggregates.
/// </summary>
public interface IHomeworkSubmissionService
{
    /// <summary>
    /// Creates a homework submission from a completed challenge attempt.
    /// </summary>
    /// <param name="attempt">The completed challenge attempt</param>
    /// <param name="homeworkId">The homework ID</param>
    /// <param name="score">The score achieved in the attempt</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if submission was created successfully, false if homework not found</returns>
    Task<bool> CreateSubmissionFromAttemptAsync(
        ChallengeAttempt attempt,
        Guid homeworkId,
        int score,
        CancellationToken cancellationToken = default);
}

