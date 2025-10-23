using Domain.Aggregates.ChallengeAggregate.ValueObjects;
using Domain.Exceptions;

using Shared.Primitives;

namespace Domain.Aggregates.ChallengeAggregate.Entities;

public sealed class ChallengeAttempt : Entity
{
    // Private constructor for EF Core
    private ChallengeAttempt()
    {
    }

    public Guid Id { get; private set; }

    public Guid ChallengeId { get; private set; }

    public string StudentName { get; private set; } = string.Empty;

    public ChallengeScore Score { get; private set; } = ChallengeScore.Zero();

    public int CompletionTime { get; private set; }

    public int CorrectAnswers { get; private set; }

    public DateTime CompletedAt { get; private set; }

    public static ChallengeAttempt Create(
        Guid challengeId,
        string studentName,
        ChallengeScore score,
        int completionTime,
        int correctAnswers)
    {
        ValidateStudentName(studentName);
        ValidateCompletionTime(completionTime);
        ValidateCorrectAnswers(correctAnswers);

        return new ChallengeAttempt
        {
            ChallengeId = challengeId,
            StudentName = studentName.Trim(),
            Score = score,
            CompletionTime = completionTime,
            CorrectAnswers = correctAnswers,
            CompletedAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    private static void ValidateStudentName(string studentName)
    {
        if (string.IsNullOrWhiteSpace(studentName))
            throw new ValidationException("Tên học sinh là bắt buộc");

        if (studentName.Length > 100)
            throw new ValidationException("Tên học sinh quá dài");
    }

    private static void ValidateCompletionTime(int completionTime)
    {
        if (completionTime < 0)
            throw new ValidationException("Thời gian hoàn thành không được âm");
    }

    private static void ValidateCorrectAnswers(int correctAnswers)
    {
        if (correctAnswers < 0)
            throw new ValidationException("Số câu trả lời đúng không được âm");
    }
}

