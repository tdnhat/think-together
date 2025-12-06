using ThinkTogether.Domain.Aggregates.UserAggregate;

namespace ThinkTogether.Domain.Aggregates.UserAggregate.Services;

public interface IAuthenticationService
{
    Task<User> AuthenticateUserAsync(string email, string password);
    Task<User> RegisterUserAsync(string email, string firstName, string lastName, string plainTextPassword);
    Task<User> RefreshUserTokenAsync(string refreshToken);
    Task<(string AccessToken, string RefreshToken, long AccessTokenExpiresAt)> GenerateTokensForUserAsync(User? user, bool rememberMe = false);
    Task<string> GeneratePasswordResetTokenWithEventAsync(string email, string resetLinkTemplate);
    Task ResetPasswordAsync(string resetToken, string newPassword);
    Task<string> GenerateEmailConfirmationTokenWithEventAsync(string email, string confirmationLinkTemplate);
    Task ConfirmEmailAsync(string confirmationToken);
}
