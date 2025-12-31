using ThinkTogether.Domain.Aggregates.QuizSetAggregate;

namespace ThinkTogether.Domain.Aggregates.ChallengeAggregate.Services;

public interface IChallengeValidationService
{
    void ValidateQuizSetForChallenge(QuizSet quizSet, Guid userId);

    Task<bool> ChallengeExistsAsync(Guid creatorId, Guid quizSetId, CancellationToken cancellationToken = default);
}

