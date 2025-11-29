using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using ThinkTogether.Application.Interfaces;

namespace ThinkTogether.Infrastructure.Services;

public sealed class CurrentUserService : ICurrentUserService, IJwtContext
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public ClaimsPrincipal? User => _httpContextAccessor.HttpContext?.User;

    public string? UserId
    {
        get
        {
            var user = User;
            if (user == null)
            {
                return null;
            }

            var subjectClaim = user.FindFirst("sub")?.Value;
            if (!string.IsNullOrWhiteSpace(subjectClaim))
            {
                return subjectClaim;
            }

            return user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        }
    }

    public bool IsAuthenticated => User?.Identity?.IsAuthenticated ?? false;

    public string? Jti => _httpContextAccessor.HttpContext?.User?.FindFirst("jti")?.Value;

    public DateTime? TokenExpiry
    {
        get
        {
            var expClaim = _httpContextAccessor.HttpContext?.User?.FindFirst("exp")?.Value;
            if (expClaim != null && long.TryParse(expClaim, out var expUnix))
            {
                return DateTimeOffset.FromUnixTimeSeconds(expUnix).DateTime;
            }

            return null;
        }
    }
}
