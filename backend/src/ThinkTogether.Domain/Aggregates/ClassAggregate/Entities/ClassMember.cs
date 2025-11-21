using Shared.Primitives;

namespace Domain.Aggregates.ClassAggregate.Entities;

public sealed class ClassMember : Entity
{
    private ClassMember()
    {
    }

    public Guid Id { get; private set; }

    public Guid ClassId { get; private set; }

    public Guid UserId { get; private set; }

    public DateTime JoinedAt { get; private set; }

    public DateTime? LeftAt { get; private set; }

    public static ClassMember Create(Guid classId, Guid userId)
    {
        if (classId == Guid.Empty)
            throw new ArgumentException("Class ID cannot be empty", nameof(classId));

        if (userId == Guid.Empty)
            throw new ArgumentException("User ID cannot be empty", nameof(userId));

        return new ClassMember
        {
            Id = Guid.NewGuid(),
            ClassId = classId,
            UserId = userId,
            JoinedAt = DateTime.UtcNow,
            LeftAt = null,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    public void MarkAsLeft()
    {
        if (LeftAt == null)
        {
            LeftAt = DateTime.UtcNow;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}

