using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Entities;
using ThinkTogether.Domain.Exceptions;
using Shared.Primitives;
using ThinkTogether.Domain.Enums;

namespace ThinkTogether.Domain.Aggregates.ChallengeAggregate;

public sealed partial class Challenge : AggregateRoot
{
    public void AddAttempt(ChallengeAttempt attempt)
    {
        if (attempt == null)
            throw new ValidationException("Nỗ lực không được null");

        _attempts.Add(attempt);
        PlayCount++;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateTitle(string title)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new ValidationException("Tiêu đề không được trống");

        if (title.Length > 255)
            throw new ValidationException("Tiêu đề không được vượt quá 255 ký tự");

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
