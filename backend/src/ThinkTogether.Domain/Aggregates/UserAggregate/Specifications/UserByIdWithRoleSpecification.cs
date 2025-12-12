using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.UserAggregate.Specifications;

/// <summary>
/// Specification to get user by ID. Role is now stored as an enum.
/// </summary>
public sealed class UserByIdWithRoleSpecification : Specification<User>
{
    public UserByIdWithRoleSpecification(Guid id)
    {
        Criteria = user => user.Id == id && user.DeletedAt == null;
    }
}
