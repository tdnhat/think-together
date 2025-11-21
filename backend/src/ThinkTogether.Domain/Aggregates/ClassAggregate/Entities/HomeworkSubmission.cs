using Shared.Primitives;

namespace Domain.Aggregates.ClassAggregate.Entities;

public enum SubmissionStatus
{
    Submitted,
    Late,
    NotSubmitted
}

public sealed class HomeworkSubmission : Entity
{
    private HomeworkSubmission()
    {
    }

    public Guid Id { get; private set; }

    public Guid HomeworkId { get; private set; }

    public Guid StudentId { get; private set; }

    public Guid ChallengeAttemptId { get; private set; }

    public int Score { get; private set; }

    public DateTime SubmittedAt { get; private set; }

    public SubmissionStatus Status { get; private set; }

    public static HomeworkSubmission Create(
        Guid homeworkId,
        Guid studentId,
        Guid challengeAttemptId,
        int score,
        DateTime? dueDate = null)
    {
        if (homeworkId == Guid.Empty)
            throw new ArgumentException("Homework ID cannot be empty", nameof(homeworkId));

        if (studentId == Guid.Empty)
            throw new ArgumentException("Student ID cannot be empty", nameof(studentId));

        if (challengeAttemptId == Guid.Empty)
            throw new ArgumentException("Challenge attempt ID cannot be empty", nameof(challengeAttemptId));

        if (score < 0)
            throw new ArgumentException("Score cannot be negative", nameof(score));

        var submittedAt = DateTime.UtcNow;
        var status = SubmissionStatus.Submitted;

        if (dueDate.HasValue && submittedAt > dueDate)
            status = SubmissionStatus.Late;

        return new HomeworkSubmission
        {
            Id = Guid.NewGuid(),
            HomeworkId = homeworkId,
            StudentId = studentId,
            ChallengeAttemptId = challengeAttemptId,
            Score = score,
            SubmittedAt = submittedAt,
            Status = status,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    public void UpdateScore(int score)
    {
        if (score < 0)
            throw new ArgumentException("Score cannot be negative", nameof(score));

        Score = score;
        UpdatedAt = DateTime.UtcNow;
    }
}

