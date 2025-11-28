using Domain.Exceptions;
using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.UserAggregate.Entities;

public enum TokenType
{
    PASSWORD_RESET,
    EMAIL_CONFIRMATION
}

public sealed partial class UserToken : Entity
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
            throw new ValidationException("User ID cannot be empty");

        if (string.IsNullOrWhiteSpace(token))
            throw new ValidationException("Token cannot be empty");

        if (lifetime <= TimeSpan.Zero)
            throw new ValidationException("Lifetime must be positive");

        return new UserToken
        {
            Id = Guid.NewGuid(),
            Type = type,
            UserId = userId,
            Token = token,
            ExpiresAt = DateTime.UtcNow.Add(lifetime)
        };
    }
}
