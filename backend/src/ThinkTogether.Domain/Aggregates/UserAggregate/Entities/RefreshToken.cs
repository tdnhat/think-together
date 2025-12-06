using Shared.Primitives;
using ThinkTogether.Domain.Exceptions;

namespace ThinkTogether.Domain.Aggregates.UserAggregate.Entities;

public sealed partial class RefreshToken : Entity
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
            throw new ValidationException("ID người dùng không được trống");

        if (string.IsNullOrWhiteSpace(token))
            throw new ValidationException("Token không được trống");

        if (lifetime <= TimeSpan.Zero)
            throw new ValidationException("Thời gian sống phải dương");

        return new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Token = token,
            ExpiresAt = DateTime.UtcNow.Add(lifetime)
        };
    }
}
