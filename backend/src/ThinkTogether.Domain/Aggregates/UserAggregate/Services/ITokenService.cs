using ThinkTogether.Domain.Aggregates.UserAggregate;
using ThinkTogether.Domain.Aggregates.UserAggregate.Entities;

namespace ThinkTogether.Domain.Aggregates.UserAggregate.Services;

public interface ITokenService
{
    Task<(string AccessToken, string RefreshToken, long AccessTokenExpiresAt)> GenerateTokensAsync(User user);
    TimeSpan GetRefreshTokenLifetime(bool rememberMe);
    RefreshToken CreateRefreshToken(Guid userId, string token, TimeSpan lifetime);
}
