using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using ThinkTogether.Domain.Aggregates.UserAggregate.Entities;
using Infrastructure.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using ThinkTogether.Domain.Aggregates.UserAggregate;
using ThinkTogether.Domain.Aggregates.UserAggregate.Services;
using ThinkTogether.Infrastructure.Interfaces;

namespace ThinkTogether.Infrastructure.Services;

public class TokenService : ITokenService
{
    private readonly JwtOptions _jwtOptions;
    private readonly ITokenClaimService _tokenClaimService;
    private readonly SymmetricSecurityKey _securityKey;

    public TokenService(
        IOptions<JwtOptions> jwtOptions,
        ITokenClaimService tokenClaimService)
    {
        _jwtOptions = jwtOptions.Value;
        _tokenClaimService = tokenClaimService;
        _securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.Secret));
    }

    public async Task<(string AccessToken, string RefreshToken, long AccessTokenExpiresAt)>
        GenerateTokensAsync(User user)
    {
        var expirationTime = DateTime.UtcNow.AddMinutes(_jwtOptions.AccessTokenExpirationMinutes);
        var accessToken = await GenerateAccessTokenAsync(user, expirationTime);
        var refreshToken = GenerateRefreshToken();

        var accessTokenExpiresAt = ((DateTimeOffset)expirationTime).ToUnixTimeSeconds();

        return (accessToken, refreshToken, accessTokenExpiresAt);
    }

    public TimeSpan GetRefreshTokenLifetime(bool rememberMe)
    {
        return rememberMe
            ? TimeSpan.FromDays(_jwtOptions.RefreshTokenExpirationDaysRememberMe)
            : TimeSpan.FromDays(_jwtOptions.RefreshTokenExpirationDays);
    }

    public RefreshToken CreateRefreshToken(Guid userId, string token, TimeSpan lifetime)
    {
        return RefreshToken.Create(userId, token, lifetime);
    }

    private async Task<string> GenerateAccessTokenAsync(User user, DateTime expirationTime)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var signingCredentials = new SigningCredentials(_securityKey, SecurityAlgorithms.HmacSha256);

        var claims = await _tokenClaimService.GetClaimsAsync(user);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = expirationTime,
            Issuer = _jwtOptions.Issuer,
            Audience = _jwtOptions.Audience,
            SigningCredentials = signingCredentials
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    private static string GenerateRefreshToken()
    {
        var randomNumber = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }
}
