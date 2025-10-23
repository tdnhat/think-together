using Domain.Aggregates.UserAggregate;
using Shared.Primitives;

namespace Domain.Aggregates.UserAggregate.Specifications;

public sealed class RefreshTokenSpecification : Specification<User>
{
    public RefreshTokenSpecification(string refreshToken)
    {
        Criteria = u => u.RefreshTokens.Any(rt => rt.Token == refreshToken);
        AddInclude(u => u.RefreshTokens);
    }
}