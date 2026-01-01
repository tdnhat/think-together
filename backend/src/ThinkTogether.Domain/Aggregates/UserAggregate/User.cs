using ThinkTogether.Domain.Aggregates.UserAggregate.Entities;
using ThinkTogether.Domain.Aggregates.UserAggregate.ValueObjects;
using Shared.Primitives;
using ThinkTogether.Domain.Enums;

namespace ThinkTogether.Domain.Aggregates.UserAggregate;

public sealed partial class User : AggregateRoot
{
    private readonly List<RefreshToken> _refreshTokens = new();
    private readonly List<UserToken> _userTokens = new();

    private User()
    {
    }

    public Guid Id { get; private set; }
    public Email Email { get; private set; } = null!;
    public Password PasswordHash { get; private set; } = null!;
    public string FirstName { get; private set; } = string.Empty;
    public string LastName { get; private set; } = string.Empty;
    public RoleType Role { get; private set; }
    public string? AvatarUrl { get; private set; }
    public string? Bio { get; private set; }
    public bool IsEmailVerified { get; private set; }
    public bool IsActive { get; private set; } = true;

    public IReadOnlyList<RefreshToken> RefreshTokens => _refreshTokens.AsReadOnly();

    public IReadOnlyList<UserToken> UserTokens => _userTokens.AsReadOnly();

    public string GetFullName() => $"{FirstName} {LastName}".Trim();
}
