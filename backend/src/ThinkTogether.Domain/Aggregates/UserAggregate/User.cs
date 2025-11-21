using Domain.Aggregates.UserAggregate.Entities;
using Domain.Aggregates.UserAggregate.ValueObjects;
using Shared.Primitives;
using ThinkTogether.Domain.Aggregates.UserAggregate.Entities;

namespace ThinkTogether.Domain.Aggregates.UserAggregate;

public sealed partial class User : AggregateRoot
{
    private readonly List<RefreshToken> _refreshTokens = new();
    private readonly List<UserToken> _userTokens = new();

    public static readonly Guid UserRoleId = Guid.Parse("11111111-1111-1111-1111-111111111111");
    public static readonly Guid CreatorRoleId = Guid.Parse("22222222-2222-2222-2222-222222222222");
    public static readonly Guid AdminRoleId = Guid.Parse("33333333-3333-3333-3333-333333333333");

    private User()
    {
    }

    public Guid Id { get; private set; }
    public Email Email { get; private set; } = null!;
    public Password PasswordHash { get; private set; } = null!;
    public string FirstName { get; private set; } = string.Empty;
    public string LastName { get; private set; } = string.Empty;
    public Guid RoleId { get; private set; }
    public Role? Role { get; private set; }
    public string? AvatarUrl { get; private set; }
    public string? Bio { get; private set; }
    public bool IsEmailVerified { get; private set; }

    public IReadOnlyList<RefreshToken> RefreshTokens => _refreshTokens.AsReadOnly();

    public IReadOnlyList<UserToken> UserTokens => _userTokens.AsReadOnly();

    public string GetFullName() => $"{FirstName} {LastName}".Trim();
}