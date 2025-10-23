using Domain.Aggregates.UserAggregate;
using Domain.Aggregates.UserAggregate.Specifications;
using Domain.Aggregates.UserAggregate.ValueObjects;
using Domain.Exceptions;
using ThinkTogether.Domain.Aggregates.UserAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.UserAggregate.Services;
using ThinkTogether.Domain.Aggregates.UserAggregate.Specifications;

namespace ThinkTogether.Infrastructure.Services;

public class AuthenticationService : IAuthenticationService
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordService _passwordService;
    private readonly ITokenService _tokenService;

    public AuthenticationService(
        IUserRepository userRepository,
        IPasswordService passwordService,
        ITokenService tokenService)
    {
        _userRepository = userRepository;
        _passwordService = passwordService;
        _tokenService = tokenService;
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
        var user = User.Create(emailValue, firstName, lastName, passwordHash);

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
}