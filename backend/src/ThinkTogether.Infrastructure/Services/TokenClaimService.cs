using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Domain.Aggregates.UserAggregate;
using ThinkTogether.Infrastructure.Interfaces;

namespace Infrastructure.Services;

public sealed class TokenClaimService : ITokenClaimService
{
    public Task<IEnumerable<Claim>> GetClaimsAsync(User user)
    {
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Email, user.Email.Value),
            new(JwtRegisteredClaimNames.GivenName, user.FirstName),
            new(JwtRegisteredClaimNames.FamilyName, user.LastName),
            new("role", user.Role.ToString()),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        if (!string.IsNullOrWhiteSpace(user.AvatarUrl))
        {
            claims.Add(new Claim("avatar_url", user.AvatarUrl));
        }

        return Task.FromResult<IEnumerable<Claim>>(claims);
    }
}

