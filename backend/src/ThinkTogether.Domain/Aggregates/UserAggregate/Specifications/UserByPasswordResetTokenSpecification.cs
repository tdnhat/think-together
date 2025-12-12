using ThinkTogether.Domain.Aggregates.UserAggregate.Entities;
using ThinkTogether.Domain.Enums;
using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.UserAggregate.Specifications;

public sealed class UserByPasswordResetTokenSpecification : Specification<User>
{
    public UserByPasswordResetTokenSpecification(string passwordResetToken)
    {
        Criteria = u => u.UserTokens.Any(ut => ut.Token == passwordResetToken && ut.Type == TokenType.PasswordReset);
        AddInclude(u => u.UserTokens);
    }
}
