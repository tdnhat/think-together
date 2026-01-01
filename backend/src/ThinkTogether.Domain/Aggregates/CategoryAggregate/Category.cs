using ThinkTogether.Domain.Exceptions;
using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.CategoryAggregate;

public sealed partial class Category : AggregateRoot
{
    private Category()
    {
    }

    public Guid Id { get; private set; }

    public string Name { get; private set; } = string.Empty;

    public string? Description { get; private set; }

    public bool IsActive { get; private set; }

    public static Category Create(string name, string? description = null)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ValidationException("Tên danh mục không được trống");

        if (name.Length > 255)
            throw new ValidationException("Tên danh mục không được vượt quá 255 ký tự");

        if (description?.Length > 2000)
            throw new ValidationException("Mô tả không được vượt quá 2000 ký tự");

        return new Category
        {
            Id = Guid.NewGuid(),
            Name = name.Trim(),
            Description = description?.Trim(),
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    public void Update(string name, string? description)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ValidationException("Tên danh mục không được trống");

        if (name.Length > 255)
            throw new ValidationException("Tên danh mục không được vượt quá 255 ký tự");

        if (description?.Length > 2000)
            throw new ValidationException("Mô tả không được vượt quá 2000 ký tự");

        Name = name.Trim();
        Description = description?.Trim();
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetActive(bool isActive)
    {
        IsActive = isActive;
        UpdatedAt = DateTime.UtcNow;
    }

    public override void Delete()
    {
        DeletedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public override void Restore()
    {
        DeletedAt = null;
        UpdatedAt = DateTime.UtcNow;
    }
}

