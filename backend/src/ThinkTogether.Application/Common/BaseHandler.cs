using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Exceptions;

namespace ThinkTogether.Application.Common;

/// <summary>
/// Base class for command/query handlers providing common helper methods.
/// </summary>
public abstract class BaseHandler
{
    protected readonly ICurrentUserService CurrentUserService;

    protected BaseHandler(ICurrentUserService currentUserService)
    {
        CurrentUserService = currentUserService;
    }

    /// <summary>
    /// Gets the current user ID as a Guid, throwing UnauthorizedException if not authenticated or invalid.
    /// </summary>
    protected Guid GetCurrentUserId()
    {
        var userIdString = CurrentUserService.UserId
            ?? throw new UnauthorizedException("Người dùng chưa đăng nhập");

        if (!Guid.TryParse(userIdString, out var userId))
            throw new UnauthorizedException("ID người dùng không hợp lệ");

        return userId;
    }

    /// <summary>
    /// Gets the current host user ID as a Guid, throwing UnauthorizedException if not authenticated or invalid.
    /// Alias for GetCurrentUserId() for consistency with existing code.
    /// </summary>
    protected Guid GetCurrentHostUserId()
    {
        return GetCurrentUserId();
    }
}

