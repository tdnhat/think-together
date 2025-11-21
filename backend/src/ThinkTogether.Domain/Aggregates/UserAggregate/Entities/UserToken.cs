using Shared.Primitives;

namespace Domain.Aggregates.UserAggregate.Entities;

public enum TokenType
{
    PASSWORD_RESET,
    EMAIL_CONFIRMATION
}

public sealed class UserToken : Entity
{
    private UserToken()
    {
    }

    public Guid Id { get; private set; }

    public TokenType Type { get; private set; }

    public Guid UserId { get; private set; }

    public string Token { get; private set; } = string.Empty;

    public DateTime ExpiresAt { get; private set; }

    public DateTime? UsedAt { get; private set; }

    public static UserToken Create(TokenType type, Guid userId, string token, TimeSpan lifetime)
    {
        if (userId == Guid.Empty)
            throw new ArgumentException("User ID cannot be empty", nameof(userId));

        if (string.IsNullOrWhiteSpace(token))
            throw new ArgumentException("Token cannot be empty", nameof(token));

        if (lifetime <= TimeSpan.Zero)
            throw new ArgumentException("Lifetime must be positive", nameof(lifetime));

        return new UserToken
        {
            Id = Guid.NewGuid(),
            Type = type,
            UserId = userId,
            Token = token,
            ExpiresAt = DateTime.UtcNow.Add(lifetime)
        };
    }

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
