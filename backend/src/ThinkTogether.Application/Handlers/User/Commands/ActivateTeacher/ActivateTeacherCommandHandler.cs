using Domain.Exceptions;
using MediatR;
using Microsoft.Extensions.Logging;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.UserAggregate.Repositories;
using ThinkTogether.Shared.Common;

namespace ThinkTogether.Application.Handlers.User.Commands.ActivateTeacher;

public sealed class ActivateTeacherCommandHandler : IRequestHandler<ActivateTeacherCommand>
{
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IUnitOfWork _unitOfWork;

    public ActivateTeacherCommandHandler(
        IUserRepository userRepository,
        ICurrentUserService currentUserService,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _currentUserService = currentUserService;
        _unitOfWork = unitOfWork;
    }

    public async Task Handle(ActivateTeacherCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;

        if (string.IsNullOrWhiteSpace(userId) || !Guid.TryParse(userId, out var userIdValue))
            throw new UnauthorizedException("ID người dùng không hợp lệ");

        var user = await _userRepository.GetByIdAsync(userIdValue, cancellationToken);

        if (user == null || user.IsDeleted)
            throw new UnauthorizedException("Không tìm thấy người dùng");

        user.ActivateTeacherRole();

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
