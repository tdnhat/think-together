using Domain.Aggregates.ChallengeAggregate.Entities;
using Domain.Aggregates.ChallengeAggregate.Enums;
using Domain.Aggregates.ChallengeAggregate.ValueObjects;
using Domain.Exceptions;

using Shared.Primitives;

namespace Domain.Aggregates.ChallengeAggregate;

public sealed class Challenge : AggregateRoot
{
    private readonly List<ChallengeAttempt> _attempts = new();
    private readonly List<LeaderboardEntry> _leaderboard = new();

    // Private constructor for EF Core
    private Challenge()
    {
    }

    public Guid Id { get; private set; }

    public Guid CreatorId { get; private set; }

    public Guid QuizSetId { get; private set; }

    public string Title { get; private set; } = string.Empty;

    public string? Description { get; private set; }

    public ShareableLink ShareLink { get; private set; } = null!;

    public ChallengeStatus Status { get; private set; }

    public bool ShowLeaderboard { get; private set; }

    public int PlayCount { get; private set; }

    public IReadOnlyList<ChallengeAttempt> Attempts => _attempts.AsReadOnly();

    public IReadOnlyList<LeaderboardEntry> Leaderboard => _leaderboard.AsReadOnly();

    public static Challenge Create(
        Guid creatorId,
        Guid quizSetId,
        string title,
        ShareableLink shareLink,
        string? description = null,
        bool showLeaderboard = true)
    {
        ValidateTitle(title);
        ValidateDescription(description);

        var challenge = new Challenge
        {
            Id = Guid.NewGuid(),
            CreatorId = creatorId,
            QuizSetId = quizSetId,
            Title = title.Trim(),
            Description = description?.Trim(),
            ShareLink = shareLink,
            Status = ChallengeStatus.HOAT_DONG,
            ShowLeaderboard = showLeaderboard,
            PlayCount = 0,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        return challenge;
    }

    public void RecordAttempt(ChallengeAttempt attempt)
    {
        if (IsDeleted)
            throw new ValidationException("Không thể ghi lại lượt chơi của thách thức đã bị xóa");

        if (Status != ChallengeStatus.HOAT_DONG)
            throw new ValidationException("Thách thức phải đang hoạt động");

        _attempts.Add(attempt);
        PlayCount++;

        // Update leaderboard if needed
        UpdateLeaderboardForAttempt(attempt);
    }

    private void UpdateLeaderboardForAttempt(ChallengeAttempt attempt)
    {
        var existingEntry = _leaderboard.FirstOrDefault(e =>
            e.StudentName.Equals(attempt.StudentName, StringComparison.OrdinalIgnoreCase));

        if (existingEntry != null)
        {
            // Update existing entry if new score is higher
            existingEntry.UpdateScore(attempt.Score);
        }
        else
        {
            // Add new entry
            var newEntry = LeaderboardEntry.Create(
                Id,
                attempt.StudentName,
                attempt.Score,
                _leaderboard.Count + 1);

            _leaderboard.Add(newEntry);
        }

        // Recalculate rankings
        RecalculateRankings();
    }

    public void RecalculateRankings()
    {
        var rankedEntries = _leaderboard
            .OrderByDescending(e => e.Score.Value)
            .ThenBy(e => e.AchievedAt)
            .ToList();

        for (int i = 0; i < rankedEntries.Count; i++)
        {
            rankedEntries[i].UpdateRank(i + 1);
        }
    }

    public void UpdateMetadata(string title, string? description = null, bool? showLeaderboard = null)
    {
        if (IsDeleted)
            throw new ValidationException("Không thể cập nhật thách thức đã bị xóa");

        ValidateTitle(title);
        ValidateDescription(description);

        Title = title.Trim();
        Description = description?.Trim();

        if (showLeaderboard.HasValue)
            ShowLeaderboard = showLeaderboard.Value;
    }

    public void Archive()
    {
        if (IsDeleted)
            throw new ValidationException("Không thể lưu trữ thách thức đã bị xóa");

        if (Status == ChallengeStatus.LUU_TRU)
            return; // Already archived

        Status = ChallengeStatus.LUU_TRU;
    }

    public void Activate()
    {
        if (IsDeleted)
            throw new ValidationException("Không thể kích hoạt thách thức đã bị xóa");

        if (Status == ChallengeStatus.HOAT_DONG)
            return; // Already active

        Status = ChallengeStatus.HOAT_DONG;
    }

    public IEnumerable<LeaderboardEntry> GetTopLeaderboard(int count = 10)
    {
        return _leaderboard
            .OrderBy(e => e.Rank)
            .Take(count);
    }

    public ChallengeAttempt? GetStudentBestAttempt(string studentName)
    {
        return _attempts
            .Where(a => a.StudentName.Equals(studentName, StringComparison.OrdinalIgnoreCase))
            .OrderByDescending(a => a.Score.Value)
            .FirstOrDefault();
    }

    public int GetUniqueStudentCount()
    {
        return _attempts
            .Select(a => a.StudentName.ToLowerInvariant())
            .Distinct()
            .Count();
    }

    public bool IsActive() => Status == ChallengeStatus.HOAT_DONG && !IsDeleted;

    public bool IsArchived() => Status == ChallengeStatus.LUU_TRU;

    private static void ValidateTitle(string title)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new ValidationException("Tiêu đề thách thức là bắt buộc");

        if (title.Length > 255)
            throw new ValidationException("Tiêu đề thách thức quá dài");
    }

    private static void ValidateDescription(string? description)
    {
        if (description != null && description.Length > 10000)
            throw new ValidationException("Mô tả thách thức quá dài");
    }
}

