using MediatR;
using Microsoft.Extensions.Options;
using ThinkTogether.Application.Configuration;
using ThinkTogether.Domain.Aggregates.UserAggregate.Services;
using ThinkTogether.Shared.Common;

namespace ThinkTogether.Application.Handlers.User.Commands.ResendEmailConfirmation;

public sealed class ResendEmailConfirmationCommandHandler : IRequestHandler<ResendEmailConfirmationCommand>
{
    private readonly IAuthenticationService _authenticationService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ApplicationOptions _applicationOptions;

    public ResendEmailConfirmationCommandHandler(
        IAuthenticationService authenticationService,
        IUnitOfWork unitOfWork,
        IOptions<ApplicationOptions> applicationOptions)
    {
        _authenticationService = authenticationService;
        _unitOfWork = unitOfWork;
        _applicationOptions = applicationOptions.Value;
    }

    public async Task Handle(ResendEmailConfirmationCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // Generate email confirmation token and raise domain event
            var confirmationLinkTemplate = $"{_applicationOptions.FrontendBaseUrl}/confirm-email?token={{token}}";
            await _authenticationService.GenerateEmailConfirmationTokenWithEventAsync(request.Email, confirmationLinkTemplate);

            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }
        catch (Exception)
        {
            // Log the exception but do not rethrow to prevent email enumeration
            // The API will return a generic success message
        }
    }
}
