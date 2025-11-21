using Shared.Primitives;

namespace Domain.Aggregates.ChallengeAggregate.Entities;

public sealed class ChallengeAnswer : Entity
{
    private ChallengeAnswer()
    {
    }

    public Guid Id { get; private set; }

    public Guid ChallengeAttemptId { get; private set; }

    public Guid QuestionId { get; private set; }

    public int SubmissionTimeMs { get; private set; }

    public bool IsCorrect { get; private set; }

    public int PointsEarned { get; private set; }

    public static ChallengeAnswer Create(
        Guid challengeAttemptId,
        Guid questionId,
        int submissionTimeMs,
        bool isCorrect,
        int pointsEarned)
    {
        if (challengeAttemptId == Guid.Empty)
            throw new ArgumentException("Challenge attempt ID cannot be empty", nameof(challengeAttemptId));

        if (questionId == Guid.Empty)
            throw new ArgumentException("Question ID cannot be empty", nameof(questionId));

        if (submissionTimeMs < 0)
            throw new ArgumentException("Submission time cannot be negative", nameof(submissionTimeMs));

        if (pointsEarned < 0)
            throw new ArgumentException("Points cannot be negative", nameof(pointsEarned));

        return new ChallengeAnswer
        {
            Id = Guid.NewGuid(),
            ChallengeAttemptId = challengeAttemptId,
            QuestionId = questionId,
            SubmissionTimeMs = submissionTimeMs,
            IsCorrect = isCorrect,
            PointsEarned = pointsEarned,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }
}

