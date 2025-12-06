using ThinkTogether.Domain.Aggregates.UserAggregate.Entities;
using ThinkTogether.Domain.Aggregates.UserAggregate.ValueObjects;
using ThinkTogether.Domain.Exceptions;
using ThinkTogether.Domain.Aggregates.UserAggregate.Events;
using ThinkTogether.Domain.Aggregates.UserAggregate.Services;
using ThinkTogether.Domain.Enums;

namespace ThinkTogether.Domain.Aggregates.UserAggregate;

public sealed partial class User
{
    public static User Create(
        Email email,
        string firstName,
        string lastName,
        Password passwordHash,
        RoleType role = RoleType.User)
    {
        ValidateNames(firstName, lastName);

        var userId = Guid.NewGuid();
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
            throw new ValidationException("Kh�ng th? c?p nh?t h? so c?a ngu?i d�ng d� b? x�a");

        ValidateNames(firstName, lastName);

        if (avatarUrl != null && avatarUrl.Length > 500)
            throw new ValidationException("URL ?nh d?i di?n qu� d�i");

        FirstName = firstName.Trim();
        LastName = lastName.Trim();
        AvatarUrl = avatarUrl?.Trim();
        Bio = bio?.Trim();
        UpdatedAt = DateTime.UtcNow;
    }

    public void ChangePassword(Password newPasswordHash)
    {
        if (IsDeleted)
            throw new ValidationException("Kh�ng th? d?i m?t kh?u c?a ngu?i d�ng d� b? x�a");

        PasswordHash = newPasswordHash;
        UpdatedAt = DateTime.UtcNow;
    }

    public void ChangePassword(string newPlainTextPassword, IPasswordService passwordService)
    {
        if (IsDeleted)
            throw new ValidationException("Kh�ng th? d?i m?t kh?u c?a ngu?i d�ng d� b? x�a");

        Password.ValidatePlainText(newPlainTextPassword);
        PasswordHash = passwordService.HashPassword(newPlainTextPassword);
        UpdatedAt = DateTime.UtcNow;
    }

    public bool VerifyPassword(string plainTextPassword, IPasswordService passwordService)
    {
        return passwordService.VerifyPassword(plainTextPassword, PasswordHash);
    }

    public void ChangeRole(RoleType newRole)
    {
        if (IsDeleted)
            throw new ValidationException("Không thể thay đổi vai trò của người dùng đã bị xóa");

        Role = newRole;
        UpdatedAt = DateTime.UtcNow;
    }

    public void ActivateCreatorRole()
    {
        if (IsDeleted)
            throw new ValidationException("Không thể kích hoạt vai trò người sáng tạo cho người dùng đã bị xóa");

        if (!IsEmailVerified)
            throw new ValidationException("Vui lòng xác nhận email trước khi trở thành người sáng tạo");

        if (Role == RoleType.Creator)
            return;

        Role = RoleType.Creator;
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
            throw new ValidationException("Kh�ng th? d?t l?i m?t kh?u c?a ngu?i d�ng d� b? x�a");

        var validToken = GetValidPasswordResetToken(resetToken);
        if (validToken == null)
            throw new ValidationException("Token d?t l?i m?t kh?u kh�ng h?p l? ho?c d� h?t h?n");

        Password.ValidatePlainText(newPlainTextPassword);
        PasswordHash = passwordService.HashPassword(newPlainTextPassword);

        validToken.MarkAsUsed();
        RevokeAllActiveUserTokens();
        UpdatedAt = DateTime.UtcNow;
    }

    public void ConfirmEmailWithToken(string confirmationToken)
    {
        if (IsDeleted)
            throw new ValidationException("Kh�ng th? x�c nh?n email c?a ngu?i d�ng d� b? x�a");

        var validToken = GetValidEmailConfirmationToken(confirmationToken);
        if (validToken == null)
            throw new ValidationException("Token x�c nh?n email kh�ng h?p l? ho?c d� h?t h?n");

        validToken.MarkAsUsed();
        IsEmailVerified = true;
        UpdatedAt = DateTime.UtcNow;
        
        AddDomainEvent(new EmailConfirmedDomainEvent(Id, Email.Value, GetFullName()));
    }

    public void RequestEmailConfirmation(string confirmationToken, string confirmationLink)
    {
        if (IsDeleted)
            throw new ValidationException("Kh�ng th? g?i email x�c nh?n cho ngu?i d�ng d� b? x�a");

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
            throw new ValidationException("Kh�ng th? g?i email d?t l?i m?t kh?u cho ngu?i d�ng d� b? x�a");

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
            throw new ValidationException("T�n d?m l� b?t bu?c");

        if (string.IsNullOrWhiteSpace(lastName))
            throw new ValidationException("T�n g?i l� b?t bu?c");

        if (firstName.Length > 100)
            throw new ValidationException("T�n d?m qu� d�i");

        if (lastName.Length > 100)
            throw new ValidationException("T�n g?i qu� d�i");
    }
}
