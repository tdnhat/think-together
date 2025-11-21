using Domain.Aggregates.UserAggregate.Entities;
using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.UserAggregate.Specifications;

public sealed class UserByUserTokenSpecification : Specification<User>
{
    public UserByUserTokenSpecification(string token, TokenType tokenType)
    {
        Criteria = u => u.UserTokens.Any(ut => ut.Token == token && ut.Type == tokenType);
        AddInclude(u => u.UserTokens);
    }
}
