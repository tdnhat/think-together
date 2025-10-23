using Shared.Primitives;

namespace Domain.Aggregates.ChallengeAggregate.Entities;

public sealed class ChallengePlayerAnswer : Entity
{
    // Private constructor for EF Core
    private ChallengePlayerAnswer()
    {
    }

    public Guid Id { get; private set; }

    public Guid ChallengeSessionId { get; private set; }

    public Guid QuestionId { get; private set; }

    public string? SubmittedAnswer { get; private set; }

    public int SubmissionTimeSeconds { get; private set; }

    public bool IsCorrect { get; private set; }

    public int PointsEarned { get; private set; }

    public static ChallengePlayerAnswer Create(
        Guid challengeSessionId,
        Guid questionId,
        string? submittedAnswer,
        int submissionTimeSeconds,
        bool isCorrect,
        int pointsEarned)
    {
        if (submissionTimeSeconds < 0)
            throw new Domain.Exceptions.ValidationException("Thời gian nộp không được âm");

        if (pointsEarned < 0)
            throw new Domain.Exceptions.ValidationException("Điểm đạt được không được âm");

        return new ChallengePlayerAnswer
        {
            ChallengeSessionId = challengeSessionId,
            QuestionId = questionId,
            SubmittedAnswer = submittedAnswer?.Trim(),
            SubmissionTimeSeconds = submissionTimeSeconds,
            IsCorrect = isCorrect,
            PointsEarned = pointsEarned,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }
}
