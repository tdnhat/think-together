using Shared.Primitives;
using ThinkTogether.Domain.Enums;

namespace ThinkTogether.Domain.Aggregates.UserAggregate.Specifications;

public sealed class UsersWithFiltersSpecification : Specification<User>
{
    public UsersWithFiltersSpecification(
        string? search = null,
        RoleType? role = null,
        string? sortBy = null,
        int page = 1,
        int pageSize = 10)
    {
        var searchLower = search?.ToLower();
        var hasSearch = !string.IsNullOrWhiteSpace(search);

        // Build criteria
        Criteria = user =>
            user.DeletedAt == null
            && (!hasSearch ||
                (user.FirstName.ToLower().Contains(searchLower!) ||
                 user.LastName.ToLower().Contains(searchLower!) ||
                 user.Email.Value.ToLower().Contains(searchLower!)))
            && (!role.HasValue || user.Role == role.Value);

        // Sorting
        switch (sortBy?.ToLower())
        {
            case "oldest":
                ApplyOrderBy(u => u.CreatedAt);
                break;
            case "name":
                ApplyOrderBy(u => u.FirstName);
                break;
            case "email":
                ApplyOrderBy(u => u.Email.Value);
                break;
            default: // newest (default)
                ApplyOrderByDescending(u => u.CreatedAt);
                break;
        }

        // Pagination
        var skip = (page - 1) * pageSize;
        ApplyPaging(skip, pageSize);
    }
}
