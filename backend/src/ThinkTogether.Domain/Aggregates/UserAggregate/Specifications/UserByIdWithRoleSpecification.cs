using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.UserAggregate.Specifications;

public sealed class UserByIdWithRoleSpecification : Specification<User>
{
    public UserByIdWithRoleSpecification(Guid id)
    {
        Criteria = user => user.Id == id && user.DeletedAt == null;
    }
}
