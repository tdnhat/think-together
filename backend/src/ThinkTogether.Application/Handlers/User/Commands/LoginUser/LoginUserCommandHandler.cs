using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Domain.Aggregates.UserAggregate.Services;
using ThinkTogether.Shared.Common;

namespace ThinkTogether.Application.Handlers.User.Commands.LoginUser;

public sealed class LoginUserCommandHandler : IRequestHandler<LoginUserCommand, AuthTokenDto>
{
    private readonly IAuthenticationService _authenticationService;
    private readonly IUnitOfWork _unitOfWork;

    public LoginUserCommandHandler(
        IAuthenticationService authenticationService,
        IUnitOfWork unitOfWork)
    {
        _authenticationService = authenticationService;
        _unitOfWork = unitOfWork;
    }

    public async Task<AuthTokenDto> Handle(LoginUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _authenticationService.AuthenticateUserAsync(request.Email, request.Password);

        var tokenResult = await _authenticationService.GenerateTokensForUserAsync(user, request.RememberMe);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new AuthTokenDto
        {
            AccessToken = tokenResult.AccessToken,
            RefreshToken = tokenResult.RefreshToken,
            ExpiresAt = tokenResult.AccessTokenExpiresAt
        };
    }
}
