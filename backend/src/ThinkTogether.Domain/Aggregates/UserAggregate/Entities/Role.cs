using Domain.Exceptions;
using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.UserAggregate.Entities;

public sealed class Role : Entity
{
    private Role()
    {
    }

    public Guid Id { get; private set; }

    public string Name { get; private set; } = string.Empty;

    public string? Description { get; private set; }

    public static Role Create(string name, string? description = null)
    {
        return new Role
        {
            Id = Guid.NewGuid(),
            Name = name,
            Description = description?.Trim(),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    public static Role Create(Guid id, string name, string? description = null)
    {
        if (id == Guid.Empty)
            throw new ValidationException("ID vai trò không được trống");

        if (string.IsNullOrWhiteSpace(name))
            throw new ValidationException("Tên vai trò không được trống");

        return new Role
        {
            Id = id,
            Name = name.Trim(),
            Description = description?.Trim(),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    public void UpdateDescription(string? description)
    {
        Description = description?.Trim();
        UpdatedAt = DateTime.UtcNow;
    }
}
