using Domain.Aggregates.ChallengeAggregate.Entities;
using Domain.Exceptions;
using Shared.Primitives;

namespace Domain.Aggregates.ChallengeAggregate;

public enum ChallengeStatus
{
    Active,
    Archived
}

public sealed partial class Challenge : AggregateRoot
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
            throw new ValidationException("ID người tạo không được trống");

        if (quizSetId == Guid.Empty)
            throw new ValidationException("ID bộ câu hỏi không được trống");

        if (string.IsNullOrWhiteSpace(title))
            throw new ValidationException("Tiêu đề không được trống");

        if (title.Length > 255)
            throw new ValidationException("Tiêu đề không được vượt quá 255 ký tự");

        if (string.IsNullOrWhiteSpace(shareLink))
            throw new ValidationException("Liên kết chia sẻ không được trống");

        if (shareLink.Length > 500)
            throw new ValidationException("Liên kết chia sẻ không được vượt quá 500 ký tự");

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
}

