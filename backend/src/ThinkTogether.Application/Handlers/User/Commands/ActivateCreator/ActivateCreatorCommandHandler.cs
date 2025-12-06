using MediatR;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.UserAggregate.Repositories;
using ThinkTogether.Domain.Exceptions;
using ThinkTogether.Shared.Common;

namespace ThinkTogether.Application.Handlers.User.Commands.ActivateCreator;

public sealed class ActivateCreatorCommandHandler : IRequestHandler<ActivateCreatorCommand>
{
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IUnitOfWork _unitOfWork;

    public ActivateCreatorCommandHandler(
        IUserRepository userRepository,
        ICurrentUserService currentUserService,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _currentUserService = currentUserService;
        _unitOfWork = unitOfWork;
    }

    public async Task Handle(ActivateCreatorCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;

        if (string.IsNullOrWhiteSpace(userId) || !Guid.TryParse(userId, out var userIdValue))
            throw new UnauthorizedException("ID người dùng không hợp lệ");

        var user = await _userRepository.GetByIdAsync(userIdValue, cancellationToken);

        if (user == null || user.IsDeleted)
            throw new UnauthorizedException("Không tìm thấy người dùng");

        user.ActivateCreatorRole();

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
