using MediatR;
using ThinkTogether.Domain.Aggregates.UserAggregate.Services;
using ThinkTogether.Shared.Common;

namespace ThinkTogether.Application.Handlers.User.Commands.ResetPassword;

public sealed class ResetPasswordCommandHandler : IRequestHandler<ResetPasswordCommand>
{
    private readonly IAuthenticationService _authenticationService;
    private readonly IUnitOfWork _unitOfWork;

    public ResetPasswordCommandHandler(
        IAuthenticationService authenticationService,
        IUnitOfWork unitOfWork)
    {
        _authenticationService = authenticationService;
        _unitOfWork = unitOfWork;
    }

    public async Task Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
    {
        await _authenticationService.ResetPasswordAsync(request.Token, request.NewPassword);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
