using Domain.Aggregates.ChallengeAggregate.ValueObjects;
using Domain.Exceptions;

using Shared.Primitives;

namespace Domain.Aggregates.ChallengeAggregate.Entities;

public sealed class LeaderboardEntry : Entity
{
    // Private constructor for EF Core
    private LeaderboardEntry()
    {
    }

    public Guid Id { get; private set; }

    public Guid ChallengeId { get; private set; }

    public string StudentName { get; private set; } = string.Empty;

    public ChallengeScore Score { get; private set; } = ChallengeScore.Zero();

    public int Rank { get; private set; }

    public DateTime AchievedAt { get; private set; }

    public static LeaderboardEntry Create(
        Guid challengeId,
        string studentName,
        ChallengeScore score,
        int rank)
    {
        ValidateStudentName(studentName);
        ValidateRank(rank);

        return new LeaderboardEntry
        {
            Id = Guid.NewGuid(),
            ChallengeId = challengeId,
            StudentName = studentName.Trim(),
            Score = score,
            Rank = rank,
            AchievedAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }


    public void UpdateScore(ChallengeScore newScore)
    {
        if (newScore > Score)
        {
            Score = newScore;
            AchievedAt = DateTime.UtcNow;
        }
    }

    public void UpdateRank(int newRank)
    {
        ValidateRank(newRank);
        Rank = newRank;
    }

    private static void ValidateStudentName(string studentName)
    {
        if (string.IsNullOrWhiteSpace(studentName))
            throw new ValidationException("Tên học sinh là bắt buộc");

        if (studentName.Length > 100)
            throw new ValidationException("Tên học sinh quá dài");
    }

    private static void ValidateRank(int rank)
    {
        if (rank < 1)
            throw new ValidationException("Thứ hạng tối thiểu là 1");
    }
}

