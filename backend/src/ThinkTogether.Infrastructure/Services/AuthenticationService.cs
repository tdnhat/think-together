using ThinkTogether.Domain.Aggregates.UserAggregate.Entities;
using ThinkTogether.Domain.Aggregates.UserAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.UserAggregate.Services;
using ThinkTogether.Domain.Aggregates.UserAggregate.Specifications;
using ThinkTogether.Domain.Enums;
using Microsoft.Extensions.Options;
using Infrastructure.Configuration;
using ThinkTogether.Domain.Aggregates.UserAggregate;
using ThinkTogether.Domain.Aggregates.UserAggregate.ValueObjects;
using ThinkTogether.Domain.Exceptions;

namespace ThinkTogether.Infrastructure.Services;

public class AuthenticationService : IAuthenticationService
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordService _passwordService;
    private readonly ITokenService _tokenService;
    private readonly AuthenticationOptions _authenticationOptions;

    public AuthenticationService(
        IUserRepository userRepository,
        IPasswordService passwordService,
        ITokenService tokenService,
        IOptions<AuthenticationOptions> authenticationOptions)
    {
        _userRepository = userRepository;
        _passwordService = passwordService;
        _tokenService = tokenService;
        _authenticationOptions = authenticationOptions.Value;
    }

    public async Task<User> AuthenticateUserAsync(string email, string password)
    {
        var emailValue = Email.Create(email);
        var specification = new UserByEmailWithRefreshTokenSpecification(emailValue);
        var user = await _userRepository.GetBySpecAsync(specification);

        if (user == null || !user.CanAuthenticate())
            throw new UnauthorizedException("Email hoặc mật khẩu không hợp lệ");

        var isPasswordValid = user.VerifyPassword(password, _passwordService);
        if (!isPasswordValid)
            throw new UnauthorizedException("Email hoặc mật khẩu không hợp lệ");

        // Clean up expired tokens
        user.RevokeExpiredRefreshTokens();

        return user;
    }

    public async Task<User> RegisterUserAsync(string email, string firstName, string lastName, string plainTextPassword)
    {
        // Validate password first
        Password.ValidatePlainText(plainTextPassword);

        var emailValue = Email.Create(email);
        var specification = new UserByEmailWithRefreshTokenSpecification(emailValue);
        var existingUser = await _userRepository.GetBySpecAsync(specification);

        if (existingUser != null)
            throw new ConflictException("Email đã được đăng ký");

        var passwordHash = _passwordService.HashPassword(plainTextPassword);
        var user = User.Create(emailValue, firstName, lastName, passwordHash, RoleType.User);

        return user;
    }

    public async Task<User> RefreshUserTokenAsync(string refreshToken)
    {
        var specification = new RefreshTokenSpecification(refreshToken);
        var user = await _userRepository.GetBySpecAsync(specification);

        if (user == null || !user.CanAuthenticate())
            throw new UnauthorizedException("Người dùng không tồn tại hoặc đã bị xóa");

        if (user.Id == Guid.Empty)
            throw new UnauthorizedException("Token refresh không hợp lệ");

        var validRefreshToken = user.GetValidRefreshToken(refreshToken);
        if (validRefreshToken == null)
            throw new UnauthorizedException("Refresh token không hợp lệ hoặc đã hết hạn");

        // Clean up expired tokens
        user.RevokeExpiredRefreshTokens();

        return user;
    }

    public async Task<(string AccessToken, string RefreshToken, long AccessTokenExpiresAt)>
        GenerateTokensForUserAsync(User? user, bool rememberMe = false)
    {
        if (user == null || !user.CanAuthenticate())
            throw new ValidationException("Người dùng không tồn tại hoặc đã bị xóa");

        var tokenResult = await _tokenService.GenerateTokensAsync(user);

        // Create and add refresh token to user with appropriate lifetime
        var refreshTokenEntity = _tokenService.CreateRefreshToken(
            user.Id,
            tokenResult.RefreshToken,
            _tokenService.GetRefreshTokenLifetime(rememberMe));

        user.AddRefreshToken(refreshTokenEntity);

        return tokenResult;
    }

    public async Task<string> GeneratePasswordResetTokenWithEventAsync(string email, string resetLinkTemplate)
    {
        var emailValue = Email.Create(email);
        var specification = new UserByEmailWithRefreshTokenSpecification(emailValue);
        var user = await _userRepository.GetBySpecAsync(specification);

        if (user == null || !user.CanAuthenticate())
            throw new ValidationException("Email không tồn tại trong hệ thống");

        // Clean up expired tokens
        user.RevokeExpiredUserTokens();

        // Generate a secure random token
        var resetToken = GenerateSecureToken();
        var tokenLifetime = TimeSpan.FromHours(_authenticationOptions.PasswordResetTokenLifetimeHours);

        var passwordResetTokenEntity = UserToken.Create(TokenType.PasswordReset, user.Id, resetToken, tokenLifetime);
        user.AddUserToken(passwordResetTokenEntity);

        // Replace {token} placeholder with actual token
        var resetLink = resetLinkTemplate.Replace("{token}", resetToken);

        // Raise domain event for password reset request
        user.RequestPasswordReset(resetToken, resetLink);

        return resetToken;
    }

    public async Task ResetPasswordAsync(string resetToken, string newPassword)
    {
        if (string.IsNullOrWhiteSpace(resetToken))
            throw new ValidationException("Token đặt lại mật khẩu là bắt buộc");

        // Find user by password reset token
        var specification = new UserByPasswordResetTokenSpecification(resetToken);
        var user = await _userRepository.GetBySpecAsync(specification);

        if (user == null || !user.CanAuthenticate())
            throw new ValidationException("Token đặt lại mật khẩu không hợp lệ");

        user.ResetPasswordWithToken(resetToken, newPassword, _passwordService);
    }

    public async Task<string> GenerateEmailConfirmationTokenWithEventAsync(string email, string confirmationLinkTemplate)
    {
        var emailValue = Email.Create(email);
        var specification = new UserByEmailWithRefreshTokenSpecification(emailValue);
        var user = await _userRepository.GetBySpecAsync(specification);

        if (user == null || !user.CanAuthenticate())
            throw new ValidationException("Email không tồn tại trong hệ thống");

        // Clean up expired tokens
        user.RevokeExpiredUserTokens();

        // Generate a secure random token
        var confirmationToken = GenerateSecureToken();
        var tokenLifetime = TimeSpan.FromHours(_authenticationOptions.EmailConfirmationTokenLifetimeHours);

        var emailConfirmationTokenEntity = UserToken.Create(TokenType.EmailConfirmation, user.Id, confirmationToken, tokenLifetime);
        user.AddUserToken(emailConfirmationTokenEntity);

        // Replace {token} placeholder with actual token
        var confirmationLink = confirmationLinkTemplate.Replace("{token}", confirmationToken);

        // Raise domain event for email confirmation request
        user.RequestEmailConfirmation(confirmationToken, confirmationLink);

        return confirmationToken;
    }

    public async Task ConfirmEmailAsync(string confirmationToken)
    {
        if (string.IsNullOrWhiteSpace(confirmationToken))
            throw new ValidationException("Token xác nhận email là bắt buộc");

        // Find user by email confirmation token
        var specification = new UserByUserTokenSpecification(confirmationToken, TokenType.EmailConfirmation);
        var user = await _userRepository.GetBySpecAsync(specification);

        if (user == null || !user.CanAuthenticate())
            throw new ValidationException("Token xác nhận email không hợp lệ");

        user.ConfirmEmailWithToken(confirmationToken);
    }

    private string GenerateSecureToken()
    {
        using var rng = System.Security.Cryptography.RandomNumberGenerator.Create();
        var bytes = new byte[_authenticationOptions.TokenGenerationByteSize];
        rng.GetBytes(bytes);
        return Convert.ToBase64String(bytes).Replace("+", "-").Replace("/", "_").Replace("=", "");
    }
}
