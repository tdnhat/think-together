using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Exceptions;

namespace ThinkTogether.Application.Common;

public abstract class BaseHandler
{
    protected readonly ICurrentUserService CurrentUserService;

    protected BaseHandler(ICurrentUserService currentUserService)
    {
        CurrentUserService = currentUserService;
    }

    protected Guid GetCurrentUserId()
    {
        var userIdString = CurrentUserService.UserId
            ?? throw new UnauthorizedException("Người dùng chưa đăng nhập");

        if (!Guid.TryParse(userIdString, out var userId))
            throw new UnauthorizedException("ID người dùng không hợp lệ");

        return userId;
    }

    protected Guid GetCurrentHostUserId()
    {
        return GetCurrentUserId();
    }
}

