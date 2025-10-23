using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Domain.Aggregates.UserAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.UserAggregate.Services;
using ThinkTogether.Shared.Common;

namespace ThinkTogether.Application.Handlers.User.Commands.RegisterUser;

public sealed class RegisterUserCommandHandler : IRequestHandler<RegisterUserCommand, AuthTokenDto>
{
    private readonly IAuthenticationService _authenticationService;
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;

    public RegisterUserCommandHandler(
        IAuthenticationService authenticationService,
        IUserRepository userRepository,
        IUnitOfWork unitOfWork)
    {
        _authenticationService = authenticationService;
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<AuthTokenDto> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _authenticationService.RegisterUserAsync(
            request.Email,
            request.FirstName,
            request.LastName,
            request.Password);

        await _userRepository.AddAsync(user, cancellationToken);

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