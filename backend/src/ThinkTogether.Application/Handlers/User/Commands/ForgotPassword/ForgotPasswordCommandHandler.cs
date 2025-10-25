using MediatR;
using Microsoft.Extensions.Options;
using ThinkTogether.Application.Configuration;
using ThinkTogether.Domain.Aggregates.UserAggregate.Services;
using ThinkTogether.Shared.Common;

namespace ThinkTogether.Application.Handlers.User.Commands.ForgotPassword;

public sealed class ForgotPasswordCommandHandler : IRequestHandler<ForgotPasswordCommand>
{
    private readonly IAuthenticationService _authenticationService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ApplicationOptions _applicationOptions;

    public ForgotPasswordCommandHandler(
        IAuthenticationService authenticationService,
        IUnitOfWork unitOfWork,
        IOptions<ApplicationOptions> applicationOptions)
    {
        _authenticationService = authenticationService;
        _unitOfWork = unitOfWork;
        _applicationOptions = applicationOptions.Value;
    }

    public async Task Handle(ForgotPasswordCommand request, CancellationToken cancellationToken)
    {
        // Generate password reset token and raise domain event
        var resetLinkTemplate = $"{_applicationOptions.FrontendBaseUrl}/reset-password?token={{token}}";
        await _authenticationService.GeneratePasswordResetTokenWithEventAsync(request.Email, resetLinkTemplate);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
