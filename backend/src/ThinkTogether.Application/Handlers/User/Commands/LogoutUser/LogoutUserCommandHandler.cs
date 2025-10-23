using Domain.Aggregates.UserAggregate.Specifications;
using Domain.Exceptions;
using MediatR;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.UserAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.UserAggregate.Services;
using ThinkTogether.Shared.Common;

namespace ThinkTogether.Application.Handlers.User.Commands.LogoutUser;

public sealed class LogoutUserCommandHandler : IRequestHandler<LogoutUserCommand>
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtContext _jwtContext;
    private readonly ITokenBlacklistService _tokenBlacklistService;
    private readonly IUnitOfWork _unitOfWork;

    public LogoutUserCommandHandler(
        IUserRepository userRepository,
        IJwtContext jwtContext,
        ITokenBlacklistService tokenBlacklistService,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _jwtContext = jwtContext;
        _tokenBlacklistService = tokenBlacklistService;
        _unitOfWork = unitOfWork;
    }

    public async Task Handle(LogoutUserCommand request, CancellationToken cancellationToken)
    {
        // Find user by refresh token
        var specification = new RefreshTokenSpecification(request.RefreshToken);
        var user = await _userRepository.GetBySpecAsync(specification, cancellationToken);

        if (user == null || !user.CanAuthenticate())
            throw new UnauthorizedException("Refresh token không hợp lệ hoặc người dùng không tồn tại");

        // Validate that the refresh token is valid
        var validRefreshToken = user.GetValidRefreshToken(request.RefreshToken);
        if (validRefreshToken == null)
            throw new UnauthorizedException("Refresh token không hợp lệ hoặc đã hết hạn");

        // Revoke all active refresh tokens
        user.RevokeAllActiveRefreshTokens();
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // Blacklist the current access token
        await BlacklistCurrentAccessTokenAsync(cancellationToken);
    }

    private async Task BlacklistCurrentAccessTokenAsync(CancellationToken cancellationToken)
    {
        var jti = _jwtContext.Jti;
        var tokenExpiry = _jwtContext.TokenExpiry;

        if (string.IsNullOrWhiteSpace(jti) || tokenExpiry == null || tokenExpiry <= DateTime.UtcNow)
        {
            return;
        }

        var remainingTime = tokenExpiry.Value - DateTime.UtcNow;
        await _tokenBlacklistService.BlacklistTokenAsync(jti, remainingTime, cancellationToken);
    }
}