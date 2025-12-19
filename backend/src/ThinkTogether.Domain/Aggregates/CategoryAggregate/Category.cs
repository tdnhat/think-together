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

    public int DisplayOrder { get; private set; }

    /// <summary>
    /// Factory method to create a new Category
    /// </summary>
    public static Category Create(string name, string? description = null, int displayOrder = 0)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ValidationException("Tên danh mục không được trống");

        if (name.Length > 255)
            throw new ValidationException("Tên danh mục không được vượt quá 255 ký tự");

        if (description?.Length > 2000)
            throw new ValidationException("Mô tả không được vượt quá 2000 ký tự");

        if (displayOrder < 0)
            throw new ValidationException("Thứ tự hiển thị phải là số không âm");

        return new Category
        {
            Id = Guid.NewGuid(),
            Name = name.Trim(),
            Description = description?.Trim(),
            IsActive = true,
            DisplayOrder = displayOrder,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    /// <summary>
    /// Update category information
    /// </summary>
    public void Update(string name, string? description, int displayOrder)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ValidationException("Tên danh mục không được trống");

        if (name.Length > 255)
            throw new ValidationException("Tên danh mục không được vượt quá 255 ký tự");

        if (description?.Length > 2000)
            throw new ValidationException("Mô tả không được vượt quá 2000 ký tự");

        if (displayOrder < 0)
            throw new ValidationException("Thứ tự hiển thị phải là số không âm");

        Name = name.Trim();
        Description = description?.Trim();
        DisplayOrder = displayOrder;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Toggle active status
    /// </summary>
    public void SetActive(bool isActive)
    {
        IsActive = isActive;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Soft delete
    /// </summary>
    public override void Delete()
    {
        DeletedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Restore soft-deleted category
    /// </summary>
    public override void Restore()
    {
        DeletedAt = null;
        UpdatedAt = DateTime.UtcNow;
    }
}

