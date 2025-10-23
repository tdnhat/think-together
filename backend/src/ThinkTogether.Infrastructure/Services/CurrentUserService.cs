using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using ThinkTogether.Application.Interfaces;

namespace ThinkTogether.Infrastructure.Services;

public sealed class CurrentUserService : ICurrentUserService
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
}