using Domain.Aggregates.UserAggregate;

namespace Application.Services;

public interface IJwtTokensGenerator
{
    Task<(string accessToken, string refreshToken, long accessTokenExpiresAt)> GenerateTokensAsync(User user);
    TimeSpan GetRefreshTokenLifetime(bool rememberMe);
}
