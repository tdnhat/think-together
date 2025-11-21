using Domain.Aggregates.UserAggregate.Entities;
using Domain.Aggregates.UserAggregate.ValueObjects;
using Domain.Exceptions;
using ThinkTogether.Domain.Aggregates.UserAggregate.Events;
using ThinkTogether.Domain.Aggregates.UserAggregate.Services;

namespace ThinkTogether.Domain.Aggregates.UserAggregate;

public sealed partial class User
{
    public static User Create(
        Email email,
        string firstName,
        string lastName,
        Password passwordHash,
        Guid roleId)
    {
        ValidateNames(firstName, lastName);

        if (roleId == Guid.Empty)
            throw new ValidationException("Vai trò không hợp lệ");

        var userId = Guid.NewGuid();
        var user = new User
        {
            Id = userId,
            Email = email,
            FirstName = firstName.Trim(),
            LastName = lastName.Trim(),
            PasswordHash = passwordHash,
            RoleId = roleId,
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
        UpdatedAt = DateTime.UtcNow;
    }

    public void ChangePassword(Password newPasswordHash)
    {
        if (IsDeleted)
            throw new ValidationException("Không thể đổi mật khẩu của người dùng đã bị xóa");

        PasswordHash = newPasswordHash;
        UpdatedAt = DateTime.UtcNow;
    }

    public void ChangePassword(string newPlainTextPassword, IPasswordService passwordService)
    {
        if (IsDeleted)
            throw new ValidationException("Không thể đổi mật khẩu của người dùng đã bị xóa");

        Password.ValidatePlainText(newPlainTextPassword);
        PasswordHash = passwordService.HashPassword(newPlainTextPassword);
        UpdatedAt = DateTime.UtcNow;
    }

    public bool VerifyPassword(string plainTextPassword, IPasswordService passwordService)
    {
        return passwordService.VerifyPassword(plainTextPassword, PasswordHash);
    }

    public void ChangeRole(Guid newRoleId)
    {
        if (IsDeleted)
            throw new ValidationException("Không thể thay đổi vai trò của người dùng đã bị xóa");

        if (newRoleId == Guid.Empty)
            throw new ValidationException("Vai trò không hợp lệ");

        RoleId = newRoleId;
        UpdatedAt = DateTime.UtcNow;
    }

    public void ActivateCreatorRole()
    {
        if (IsDeleted)
            throw new ValidationException("Không thể kích hoạt vai trò người sáng tạo cho người dùng đã bị xóa");

        if (!IsEmailVerified)
            throw new ValidationException("Vui lòng xác nhận email trước khi trở thành người sáng tạo");

        if (RoleId == CreatorRoleId)
            return;

        RoleId = CreatorRoleId;
        UpdatedAt = DateTime.UtcNow;
    }

    public override void Delete()
    {
        if (IsDeleted)
            return;

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

        validToken.MarkAsUsed();
        RevokeAllActiveUserTokens();
        UpdatedAt = DateTime.UtcNow;
    }

    public void ConfirmEmailWithToken(string confirmationToken)
    {
        if (IsDeleted)
            throw new ValidationException("Không thể xác nhận email của người dùng đã bị xóa");

        var validToken = GetValidEmailConfirmationToken(confirmationToken);
        if (validToken == null)
            throw new ValidationException("Token xác nhận email không hợp lệ hoặc đã hết hạn");

        validToken.MarkAsUsed();
        IsEmailVerified = true;
        UpdatedAt = DateTime.UtcNow;
        
        AddDomainEvent(new EmailConfirmedDomainEvent(Id, Email.Value, GetFullName()));
    }

    public void RequestEmailConfirmation(string confirmationToken, string confirmationLink)
    {
        if (IsDeleted)
            throw new ValidationException("Không thể gửi email xác nhận cho người dùng đã bị xóa");

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

        AddDomainEvent(new PasswordResetRequestedDomainEvent(
            Id, 
            Email.Value, 
            GetFullName(), 
            resetToken, 
            resetLink));
    }

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

