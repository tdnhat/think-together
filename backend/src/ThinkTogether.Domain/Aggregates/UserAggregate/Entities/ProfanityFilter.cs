using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.UserAggregate.Entities;

public sealed class ProfanityFilter : Entity
{
    // Private constructor for EF Core
    private ProfanityFilter()
    {
    }

    public Guid Id { get; private set; }

    public string Pattern { get; private set; } = string.Empty;

    public SeverityLevel Severity { get; private set; }

    public bool IsActive { get; private set; }

    public static ProfanityFilter Create(
        string pattern,
        SeverityLevel severity = SeverityLevel.MEDIUM)
    {
        if (string.IsNullOrWhiteSpace(pattern))
            throw new global::Domain.Exceptions.ValidationException("Pattern lọc từ tục là bắt buộc");

        return new ProfanityFilter
        {
            Pattern = pattern.Trim(),
            Severity = severity,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    public void UpdatePattern(string newPattern)
    {
        if (string.IsNullOrWhiteSpace(newPattern))
            throw new global::Domain.Exceptions.ValidationException("Pattern lọc từ tục là bắt buộc");

        Pattern = newPattern.Trim();
        UpdatedAt = DateTime.UtcNow;
    }

    public void ToggleActive()
    {
        IsActive = !IsActive;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateSeverity(SeverityLevel newSeverity)
    {
        Severity = newSeverity;
        UpdatedAt = DateTime.UtcNow;
    }
}

public enum SeverityLevel
{
    LOW,
    MEDIUM,
    HIGH
}
