using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.UserAggregate.Entities;

public sealed class AuditLog : Entity
{
    // Private constructor for EF Core
    private AuditLog()
    {
    }

    public Guid Id { get; private set; }

    public Guid ChangedById { get; private set; }

    public EntityType EntityType { get; private set; }

    public Guid EntityId { get; private set; }

    public ActionType Action { get; private set; }

    public string? OldValues { get; private set; } // JSON snapshot

    public string? NewValues { get; private set; } // JSON snapshot

    public string? IpAddress { get; private set; }

    public static AuditLog Create(
        Guid changedById,
        EntityType entityType,
        Guid entityId,
        ActionType action,
        string? oldValues = null,
        string? newValues = null,
        string? ipAddress = null)
    {
        return new AuditLog
        {
            Id = Guid.NewGuid(),
            ChangedById = changedById,
            EntityType = entityType,
            EntityId = entityId,
            Action = action,
            OldValues = oldValues,
            NewValues = newValues,
            IpAddress = ipAddress?.Trim(),
            CreatedAt = DateTime.UtcNow
        };
    }
}

public enum EntityType
{
    NGUOI_DUNG,     // User
    BO_TRUC_NGHIEM, // QuizSet
    CAU_HOI,        // Question
    PHIEM_CHOI,     // GameSession
    THACH_THUC      // Challenge
}

public enum ActionType
{
    TAO,     // Create
    CAP_NHAT, // Update
    XOA      // Delete
}
