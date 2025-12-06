using ThinkTogether.Domain.Exceptions;
using Shared.Primitives;
using ThinkTogether.Domain.Enums;

namespace ThinkTogether.Domain.Aggregates.ClassAggregate.Entities;

public sealed partial class HomeworkSubmission : Entity
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
            throw new ValidationException("ID bài tập về nhà không được trống");

        if (studentId == Guid.Empty)
            throw new ValidationException("ID học sinh không được trống");

        if (challengeAttemptId == Guid.Empty)
            throw new ValidationException("ID nỗ lực thử thách không được trống");

        if (score < 0)
            throw new ValidationException("Điểm không được âm");

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
}
