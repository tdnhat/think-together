using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.UserAggregate.Entities;

public sealed partial class UserToken : Entity
{
    public bool IsExpired() => DateTime.UtcNow >= ExpiresAt;

    public bool IsUsed() => UsedAt.HasValue;

    public bool IsValid() => !IsExpired() && !IsUsed();

    public void MarkAsUsed()
    {
        if (IsUsed())
            return;

        UsedAt = DateTime.UtcNow;
    }

    // Helper methods for specific token types
    public bool IsPasswordResetToken() => Type == TokenType.PASSWORD_RESET;
    public bool IsEmailConfirmationToken() => Type == TokenType.EMAIL_CONFIRMATION;
}
