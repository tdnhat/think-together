namespace ThinkTogether.Domain.Aggregates.UserAggregate.Entities;

public sealed partial class RefreshToken
{
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
