using Domain.Aggregates.UserAggregate.Entities;
using Domain.Aggregates.UserAggregate.ValueObjects;
using Domain.Exceptions;
using Shared.Primitives;
using ThinkTogether.Domain.Aggregates.UserAggregate.Entities;
using ThinkTogether.Domain.Aggregates.UserAggregate.Events;
using ThinkTogether.Domain.Aggregates.UserAggregate.Services;

namespace Domain.Aggregates.UserAggregate;

public sealed class User : AggregateRoot
{
    private readonly List<RefreshToken> _refreshTokens = new();
    private readonly List<UserToken> _userTokens = new();

    // Private constructor for EF Core
    private User()
    {
    }

    public Guid Id { get; private set; }

    public Email Email { get; private set; } = null!;

    public Password PasswordHash { get; private set; } = null!;

    public string FirstName { get; private set; } = string.Empty;

    public string LastName { get; private set; } = string.Empty;

    public UserRole Role { get; private set; } = UserRole.GIAOVIEN;

    public string? AvatarUrl { get; private set; }

    public string? Bio { get; private set; }

    public IReadOnlyList<RefreshToken> RefreshTokens => _refreshTokens.AsReadOnly();

    public IReadOnlyList<UserToken> UserTokens => _userTokens.AsReadOnly();

    public static User Create(
        Email email,
        string firstName,
        string lastName,
        Password passwordHash,
        UserRole role = UserRole.GIAOVIEN)
    {
        ValidateNames(firstName, lastName);

        var userId = Guid.NewGuid(); // Generate ID in application
        var user = new User
        {
            Id = userId,
            Email = email,
            FirstName = firstName.Trim(),
            LastName = lastName.Trim(),
            PasswordHash = passwordHash,
            Role = role,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        user.AddDomainEvent(new UserRegisteredDomainEvent(
            user.Id,
            user.Email.Value,
            user.GetFullName()));

        return user;
    }

    public void UpdateProfile(string firstName, string lastName, string? avatarUrl, string? bio)
    {
        if (IsDeleted)
            throw new ValidationException("Không thể cập nhật hồ sơ của người dùng đã bị xóa");

        ValidateNames(firstName, lastName);

        if (avatarUrl != null && avatarUrl.Length > 500)
            throw new ValidationException("URL ảnh đại diện quá dài");

        FirstName = firstName.Trim();
        LastName = lastName.Trim();
        AvatarUrl = avatarUrl?.Trim();
        Bio = bio?.Trim();
    }

    public void ChangePassword(Password newPasswordHash)
    {
        if (IsDeleted)
            throw new ValidationException("Không thể đổi mật khẩu của người dùng đã bị xóa");

        PasswordHash = newPasswordHash;
    }

    public void ChangePassword(string newPlainTextPassword, IPasswordService passwordService)
    {
        if (IsDeleted)
            throw new ValidationException("Không thể đổi mật khẩu của người dùng đã bị xóa");

        Password.ValidatePlainText(newPlainTextPassword);
        PasswordHash = passwordService.HashPassword(newPlainTextPassword);
    }

    public bool VerifyPassword(string plainTextPassword, IPasswordService passwordService)
    {
        return passwordService.VerifyPassword(plainTextPassword, PasswordHash);
    }

    public void PromoteToAdmin()
    {
        if (IsDeleted)
            throw new ValidationException("Không thể nâng cấp người dùng đã bị xóa");

        if (Role == UserRole.QUANTRI)
            return; // Already an admin

        Role = UserRole.QUANTRI;
    }

    public void DemoteToTeacher()
    {
        if (IsDeleted)
            throw new ValidationException("Không thể hạ cấp người dùng đã bị xóa");

        if (Role == UserRole.GIAOVIEN)
            return; // Already a teacher

        Role = UserRole.GIAOVIEN;
    }

    public override void Delete()
    {
        if (IsDeleted)
            return; // Already deleted

        base.Delete();
    }

    public void AddRefreshToken(RefreshToken refreshToken)
    {
        if (refreshToken == null)
            throw new ArgumentNullException(nameof(refreshToken));

        if (refreshToken.UserId != Id)
            throw new ValidationException("Refresh token does not belong to this user");

        _refreshTokens.Add(refreshToken);
    }

    public RefreshToken? GetValidRefreshToken(string token)
    {
        return _refreshTokens.FirstOrDefault(rt => rt.Token == token && rt.IsValid());
    }

    public void RevokeExpiredRefreshTokens()
    {
        var expiredTokens = _refreshTokens.Where(rt => rt.IsExpired()).ToList();
        foreach (var token in expiredTokens)
        {
            token.Revoke();
        }
    }

    public void RevokeAllActiveRefreshTokens()
    {
        var activeTokens = _refreshTokens.Where(rt => rt.IsValid()).ToList();
        foreach (var token in activeTokens)
        {
            token.Revoke();
        }
    }

    public void AddUserToken(UserToken userToken)
    {
        if (userToken == null)
            throw new ArgumentNullException(nameof(userToken));

        if (userToken.UserId != Id)
            throw new ValidationException("User token does not belong to this user");

        _userTokens.Add(userToken);
    }

    public UserToken? GetValidPasswordResetToken(string token)
    {
        return _userTokens.FirstOrDefault(ut => 
            ut.Token == token && 
            ut.IsValid() && 
            ut.IsPasswordResetToken());
    }

    public UserToken? GetValidEmailConfirmationToken(string token)
    {
        return _userTokens.FirstOrDefault(ut => 
            ut.Token == token && 
            ut.IsValid() && 
            ut.IsEmailConfirmationToken());
    }

    public void RevokeExpiredUserTokens()
    {
        var expiredTokens = _userTokens.Where(ut => ut.IsExpired()).ToList();
        foreach (var token in expiredTokens)
        {
            token.MarkAsUsed();
        }
    }

    public void RevokeAllActiveUserTokens()
    {
        var activeTokens = _userTokens.Where(ut => ut.IsValid()).ToList();
        foreach (var token in activeTokens)
        {
            token.MarkAsUsed();
        }
    }

    public bool CanAuthenticate()
    {
        return !IsDeleted;
    }

    public void ResetPasswordWithToken(string resetToken, string newPlainTextPassword, IPasswordService passwordService)
    {
        if (IsDeleted)
            throw new ValidationException("Không thể đặt lại mật khẩu của người dùng đã bị xóa");

        var validToken = GetValidPasswordResetToken(resetToken);
        if (validToken == null)
            throw new ValidationException("Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn");

        Password.ValidatePlainText(newPlainTextPassword);
        PasswordHash = passwordService.HashPassword(newPlainTextPassword);

        // Mark token as used and revoke all other password reset tokens for security
        validToken.MarkAsUsed();
        RevokeAllActiveUserTokens();
    }

    public void ConfirmEmailWithToken(string confirmationToken)
    {
        if (IsDeleted)
            throw new ValidationException("Không thể xác nhận email của người dùng đã bị xóa");

        var validToken = GetValidEmailConfirmationToken(confirmationToken);
        if (validToken == null)
            throw new ValidationException("Token xác nhận email không hợp lệ hoặc đã hết hạn");

        // Mark token as used
        validToken.MarkAsUsed();
        
        // Add domain event for email confirmation
        AddDomainEvent(new EmailConfirmedDomainEvent(Id, Email.Value, GetFullName()));
    }

    public void RequestEmailConfirmation(string confirmationToken, string confirmationLink)
    {
        if (IsDeleted)
            throw new ValidationException("Không thể gửi email xác nhận cho người dùng đã bị xóa");

        // Add domain event for email confirmation request
        AddDomainEvent(new EmailConfirmationRequestedDomainEvent(
            Id, 
            Email.Value, 
            GetFullName(), 
            confirmationToken, 
            confirmationLink));
    }

    public void RequestPasswordReset(string resetToken, string resetLink)
    {
        if (IsDeleted)
            throw new ValidationException("Không thể gửi email đặt lại mật khẩu cho người dùng đã bị xóa");

        // Add domain event for password reset request
        AddDomainEvent(new PasswordResetRequestedDomainEvent(
            Id, 
            Email.Value, 
            GetFullName(), 
            resetToken, 
            resetLink));
    }

    public string GetFullName() => $"{FirstName} {LastName}".Trim();

    public bool IsAdmin() => Role == UserRole.QUANTRI;

    public bool IsTeacher() => Role == UserRole.GIAOVIEN;

    private static void ValidateNames(string firstName, string lastName)
    {
        if (string.IsNullOrWhiteSpace(firstName))
            throw new ValidationException("Tên đệm là bắt buộc");

        if (string.IsNullOrWhiteSpace(lastName))
            throw new ValidationException("Tên gọi là bắt buộc");

        if (firstName.Length > 100)
            throw new ValidationException("Tên đệm quá dài");

        if (lastName.Length > 100)
            throw new ValidationException("Tên gọi quá dài");
    }
}