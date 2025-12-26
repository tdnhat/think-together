using ThinkTogether.Domain.Aggregates.QuizSetAggregate;

namespace ThinkTogether.Domain.Aggregates.ChallengeAggregate.Services;

/// <summary>
/// Service for validating challenge creation rules.
/// </summary>
public interface IChallengeValidationService
{
    /// <summary>
    /// Validates that a quiz set can be used to create a challenge.
    /// </summary>
    /// <param name="quizSet">The quiz set to validate</param>
    /// <param name="userId">The user ID creating the challenge</param>
    /// <exception cref="ThinkTogether.Domain.Exceptions.ForbiddenException">Thrown if user doesn't own the quiz set</exception>
    /// <exception cref="ThinkTogether.Domain.Exceptions.ValidationException">Thrown if quiz set is not published or has no questions</exception>
    void ValidateQuizSetForChallenge(QuizSet quizSet, Guid userId);

    /// <summary>
    /// Checks if a challenge already exists for the given creator and quiz set.
    /// </summary>
    /// <param name="creatorId">The creator's user ID</param>
    /// <param name="quizSetId">The quiz set ID</param>
    /// <returns>True if a challenge already exists, false otherwise</returns>
    Task<bool> ChallengeExistsAsync(Guid creatorId, Guid quizSetId, CancellationToken cancellationToken = default);
}

