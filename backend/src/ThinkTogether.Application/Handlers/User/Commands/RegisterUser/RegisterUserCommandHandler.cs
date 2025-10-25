using MediatR;
using Microsoft.Extensions.Options;
using ThinkTogether.Application.Configuration;
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
    private readonly ApplicationOptions _applicationOptions;

    public RegisterUserCommandHandler(
        IAuthenticationService authenticationService,
        IUserRepository userRepository,
        IUnitOfWork unitOfWork,
        IOptions<ApplicationOptions> applicationOptions)
    {
        _authenticationService = authenticationService;
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
        _applicationOptions = applicationOptions.Value;
    }

    public async Task<AuthTokenDto> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _authenticationService.RegisterUserAsync(
            request.Email,
            request.FirstName,
            request.LastName,
            request.Password);

        await _userRepository.AddAsync(user, cancellationToken);

        // Save changes first so the user exists in the database
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // Generate email confirmation token and raise domain event
        var confirmationLink = $"{_applicationOptions.FrontendBaseUrl}/confirm-email?token={{token}}";
        await _authenticationService.GenerateEmailConfirmationTokenWithEventAsync(request.Email, confirmationLink);

        // Save changes again to persist the email confirmation token and domain event
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // Return empty tokens - user needs to confirm email first
        return new AuthTokenDto
        {
            AccessToken = string.Empty,
            RefreshToken = string.Empty,
            ExpiresAt = 0
        };
    }
}