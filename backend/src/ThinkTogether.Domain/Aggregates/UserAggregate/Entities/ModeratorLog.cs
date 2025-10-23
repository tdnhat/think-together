using Shared.Primitives;

namespace Domain.Aggregates.UserAggregate.Entities;

public sealed class ModeratorLog : Entity
{
    // Private constructor for EF Core
    private ModeratorLog()
    {
    }

    public Guid Id { get; private set; }

    public Guid AdminId { get; private set; }

    public ModeratorAction Action { get; private set; }

    public EntityType EntityType { get; private set; }

    public Guid EntityId { get; private set; }

    public string Reason { get; private set; } = string.Empty;

    public string? Notes { get; private set; }

    public bool Resolved { get; private set; }

    public DateTime? ResolvedAt { get; private set; }

    public static ModeratorLog Create(
        Guid adminId,
        ModeratorAction action,
        EntityType entityType,
        Guid entityId,
        string reason,
        string? notes = null)
    {
        if (string.IsNullOrWhiteSpace(reason))
            throw new Domain.Exceptions.ValidationException("Lý do là bắt buộc");

        return new ModeratorLog
        {
            AdminId = adminId,
            Action = action,
            EntityType = entityType,
            EntityId = entityId,
            Reason = reason.Trim(),
            Notes = notes?.Trim(),
            Resolved = false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    public void MarkResolved(DateTime? resolvedAt = null)
    {
        Resolved = true;
        ResolvedAt = resolvedAt ?? DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }
}

public enum ModeratorAction
{
    XEM_XET,     // Review
    DUYET,       // Approve
    TU_CHOI,     // Reject
    BAN_USER,    // Ban User
    XOA_NOI_DUNG // Delete Content
}
