using MediatR;
using ThinkTogether.Domain.Aggregates.UserAggregate.Services;
using ThinkTogether.Shared.Common;

namespace ThinkTogether.Application.Handlers.User.Commands.ConfirmEmail;

public sealed class ConfirmEmailCommandHandler : IRequestHandler<ConfirmEmailCommand>
{
    private readonly IAuthenticationService _authenticationService;
    private readonly IUnitOfWork _unitOfWork;

    public ConfirmEmailCommandHandler(
        IAuthenticationService authenticationService,
        IUnitOfWork unitOfWork)
    {
        _authenticationService = authenticationService;
        _unitOfWork = unitOfWork;
    }

    public async Task Handle(ConfirmEmailCommand request, CancellationToken cancellationToken)
    {
        // Confirm the email (this will trigger the EmailConfirmedDomainEvent)
        await _authenticationService.ConfirmEmailAsync(request.Token);
        
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
