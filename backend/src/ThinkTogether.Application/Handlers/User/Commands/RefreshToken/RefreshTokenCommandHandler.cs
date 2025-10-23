using Application.Handlers.User.Commands.RefreshToken;
using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Domain.Aggregates.UserAggregate.Services;
using ThinkTogether.Shared.Common;

namespace ThinkTogether.Application.Handlers.User.Commands.RefreshToken;

public sealed class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, AuthTokenDto>
{
    private readonly IAuthenticationService _authenticationService;
    private readonly IUnitOfWork _unitOfWork;

    public RefreshTokenCommandHandler(
        IAuthenticationService authenticationService,
        IUnitOfWork unitOfWork)
    {
        _authenticationService = authenticationService;
        _unitOfWork = unitOfWork;
    }

    public async Task<AuthTokenDto> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        var user = await _authenticationService.RefreshUserTokenAsync(request.Token);

        // Revoke all current active refresh tokens for security
        user.RevokeAllActiveRefreshTokens();

        var tokenResult = await _authenticationService.GenerateTokensForUserAsync(user);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new AuthTokenDto
        {
            AccessToken = tokenResult.AccessToken,
            RefreshToken = tokenResult.RefreshToken,
            ExpiresAt = tokenResult.AccessTokenExpiresAt
        };
    }
}