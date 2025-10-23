using System.Security.Claims;

namespace ThinkTogether.Application.Interfaces;

public interface ICurrentUserService
{
    ClaimsPrincipal? User { get; }
    string? UserId { get; }
    bool IsAuthenticated { get; }
}
