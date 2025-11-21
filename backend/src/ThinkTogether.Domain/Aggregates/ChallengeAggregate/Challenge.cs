using Domain.Aggregates.ChallengeAggregate.Entities;
using Shared.Primitives;

namespace Domain.Aggregates.ChallengeAggregate;

public enum ChallengeStatus
{
    Active,
    Archived
}

public sealed class Challenge : AggregateRoot
{
    private readonly List<ChallengeAttempt> _attempts = new();

    private Challenge()
    {
    }

    public Guid Id { get; private set; }

    public Guid CreatorId { get; private set; }

    public Guid QuizSetId { get; private set; }

    public string Title { get; private set; } = string.Empty;

    public string? Description { get; private set; }

    public string ShareLink { get; private set; } = string.Empty;

    public ChallengeStatus Status { get; private set; }

    public bool ShowLeaderboard { get; private set; }

    public int PlayCount { get; private set; }

    public IReadOnlyList<ChallengeAttempt> Attempts => _attempts.AsReadOnly();

    public static Challenge Create(
        Guid creatorId,
        Guid quizSetId,
        string title,
        string? description,
        string shareLink)
    {
        if (creatorId == Guid.Empty)
            throw new ArgumentException("Creator ID cannot be empty", nameof(creatorId));

        if (quizSetId == Guid.Empty)
            throw new ArgumentException("Quiz set ID cannot be empty", nameof(quizSetId));

        if (string.IsNullOrWhiteSpace(title))
            throw new ArgumentException("Title cannot be empty", nameof(title));

        if (title.Length > 255)
            throw new ArgumentException("Title cannot exceed 255 characters", nameof(title));

        if (string.IsNullOrWhiteSpace(shareLink))
            throw new ArgumentException("Share link cannot be empty", nameof(shareLink));

        if (shareLink.Length > 500)
            throw new ArgumentException("Share link cannot exceed 500 characters", nameof(shareLink));

        return new Challenge
        {
            Id = Guid.NewGuid(),
            CreatorId = creatorId,
            QuizSetId = quizSetId,
            Title = title.Trim(),
            Description = description?.Trim(),
            ShareLink = shareLink.Trim(),
            Status = ChallengeStatus.Active,
            ShowLeaderboard = true,
            PlayCount = 0,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    public void AddAttempt(ChallengeAttempt attempt)
    {
        if (attempt == null)
            throw new ArgumentNullException(nameof(attempt));

        _attempts.Add(attempt);
        PlayCount++;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateTitle(string title)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new ArgumentException("Title cannot be empty", nameof(title));

        if (title.Length > 255)
            throw new ArgumentException("Title cannot exceed 255 characters", nameof(title));

        Title = title.Trim();
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateDescription(string? description)
    {
        Description = description?.Trim();
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetShowLeaderboard(bool show)
    {
        ShowLeaderboard = show;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Archive()
    {
        Status = ChallengeStatus.Archived;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Activate()
    {
        Status = ChallengeStatus.Active;
        UpdatedAt = DateTime.UtcNow;
    }
}

