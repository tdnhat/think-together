using Shared.Primitives;

namespace Domain.Aggregates.UserAggregate.Entities;

public sealed class RefreshToken : Entity
{
    private RefreshToken()
    {
    }

    public Guid Id { get; private set; }

    public Guid UserId { get; private set; }

    public string Token { get; private set; } = string.Empty;

    public DateTime ExpiresAt { get; private set; }

    public DateTime? RevokedAt { get; private set; }

    public static RefreshToken Create(Guid userId, string token, TimeSpan lifetime)
    {
        if (userId == Guid.Empty)
            throw new ArgumentException("User ID cannot be empty", nameof(userId));

        if (string.IsNullOrWhiteSpace(token))
            throw new ArgumentException("Token cannot be empty", nameof(token));

        if (lifetime <= TimeSpan.Zero)
            throw new ArgumentException("Lifetime must be positive", nameof(lifetime));

        return new RefreshToken
        {
            UserId = userId,
            Token = token,
            ExpiresAt = DateTime.UtcNow.Add(lifetime)
        };
    }

    public bool IsExpired() => DateTime.UtcNow >= ExpiresAt;

    public bool IsRevoked() => RevokedAt.HasValue;

    public bool IsValid() => !IsExpired() && !IsRevoked();

    public void Revoke()
    {
        if (IsRevoked())
            return;

        RevokedAt = DateTime.UtcNow;
    }
}