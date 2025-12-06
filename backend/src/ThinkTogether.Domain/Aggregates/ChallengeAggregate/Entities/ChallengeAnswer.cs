using ThinkTogether.Domain.Exceptions;
using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.ChallengeAggregate.Entities;

public sealed partial class ChallengeAnswer : Entity
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
            throw new ValidationException("ID nỗ lực thử thách không được trống");

        if (questionId == Guid.Empty)
            throw new ValidationException("ID câu hỏi không được trống");

        if (submissionTimeMs < 0)
            throw new ValidationException("Thời gian nộp không được âm");

        if (pointsEarned < 0)
            throw new ValidationException("Điểm kiếm được không được âm");

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
