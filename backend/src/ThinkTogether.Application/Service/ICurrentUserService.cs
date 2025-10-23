using System.Security.Claims;

namespace Application.Services;

public interface ICurrentUserService
{
    ClaimsPrincipal? User { get; }
    string? UserId { get; }
    bool IsAuthenticated { get; }
}

