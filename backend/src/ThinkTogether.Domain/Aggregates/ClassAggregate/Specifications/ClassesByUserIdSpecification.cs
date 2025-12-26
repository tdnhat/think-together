using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.ClassAggregate.Specifications;

/// <summary>
/// Specification to get classes where user is either teacher or member.
/// Note: This specification works with a pre-filtered list since we need to check both teacher and member relationships.
/// The actual filtering by userId should be done via repository methods GetByTeacherIdAsync/GetByMemberIdAsync,
/// then this specification can be applied for search and pagination.
/// </summary>
public sealed class ClassesByUserIdSpecification : Specification<Class>
{
    public ClassesByUserIdSpecification(
        string? search = null,
        string? sortBy = null,
        int page = 1,
        int pageSize = 20)
    {
        // Base criteria: not deleted
        Criteria = classEntity => classEntity.DeletedAt == null;

        // Search filter
        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchLower = search.ToLowerInvariant();
            Criteria = classEntity => classEntity.DeletedAt == null
                && (classEntity.Name.ToLowerInvariant().Contains(searchLower)
                    || (classEntity.Description != null && classEntity.Description.ToLowerInvariant().Contains(searchLower)));
        }

        // Sorting (default: by updated date descending)
        switch (sortBy?.ToLower())
        {
            case "name":
                ApplyOrderBy(classEntity => classEntity.Name);
                break;
            case "created":
                ApplyOrderBy(classEntity => classEntity.CreatedAt);
                break;
            default:
                ApplyOrderByDescending(classEntity => classEntity.UpdatedAt);
                break;
        }

        // Pagination
        var skip = (page - 1) * pageSize;
        ApplyPaging(skip, pageSize);
    }
}

