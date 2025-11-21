using Domain.Aggregates.UserAggregate.Entities;
using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.UserAggregate.Specifications;

public sealed class UserByPasswordResetTokenSpecification : Specification<User>
{
    public UserByPasswordResetTokenSpecification(string passwordResetToken)
    {
        Criteria = u => u.UserTokens.Any(ut => ut.Token == passwordResetToken && ut.Type == TokenType.PASSWORD_RESET);
        AddInclude(u => u.UserTokens);
    }
}
