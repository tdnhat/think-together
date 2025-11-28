using Domain.Aggregates.UserAggregate;
using Domain.Aggregates.UserAggregate.ValueObjects;
using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.UserAggregate.Specifications;

public sealed class UserByEmailWithRefreshTokenSpecification : Specification<User>
{
    public UserByEmailWithRefreshTokenSpecification(Email email)
    {
        Criteria = user => user.Email == email && user.DeletedAt == null;
        AddInclude(user => user.RefreshTokens);
    }
}
