using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Application.Services;
using Domain.Aggregates.UserAggregate;
using Infrastructure.Configuration;

namespace Infrastructure.Services;

public sealed class JwtTokensGenerator : IJwtTokensGenerator
{
    private readonly JwtOptions _jwtOptions;
    private readonly ITokenClaimService _tokenClaimService;
    private readonly SymmetricSecurityKey _securityKey;

    public JwtTokensGenerator(
        IOptions<JwtOptions> jwtOptions,
        ITokenClaimService tokenClaimService)
    {
        _jwtOptions = jwtOptions.Value;
        _tokenClaimService = tokenClaimService;
        _securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.Secret));
    }

    public async Task<(string accessToken, string refreshToken, long accessTokenExpiresAt)> GenerateTokensAsync(User user)
    {
        var expirationTime = DateTime.UtcNow.AddMinutes(_jwtOptions.AccessTokenExpirationMinutes);
        var accessToken = await GenerateAccessTokenAsync(user, expirationTime);
        var refreshToken = GenerateRefreshToken();

        var accessTokenExpiresAt = ((DateTimeOffset)expirationTime).ToUnixTimeSeconds();

        return (accessToken, refreshToken, accessTokenExpiresAt);
    }

    public  TimeSpan GetRefreshTokenLifetime(bool rememberMe)
    {
        return rememberMe
            ? TimeSpan.FromDays(_jwtOptions.RefreshTokenExpirationDaysRememberMe)
            : TimeSpan.FromDays(_jwtOptions.RefreshTokenExpirationDays);
    }

    private async Task<string> GenerateAccessTokenAsync(User user, DateTime expirationTime)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var signingCredentials = new SigningCredentials(_securityKey, SecurityAlgorithms.HmacSha256);

        var claims = await _tokenClaimService.GetClaimsAsync(user);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new System.Security.Claims.ClaimsIdentity(claims),
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
