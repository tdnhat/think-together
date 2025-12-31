using MediatR;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Enums;
using ThinkTogether.Domain.Aggregates.UserAggregate.Repositories;
using ThinkTogether.Domain.Exceptions;

namespace ThinkTogether.Application.Handlers.User.Queries.GetUserCreatorStatus;

public sealed class GetUserCreatorStatusQueryHandler : IRequestHandler<GetUserCreatorStatusQuery, UserCreatorStatusDto>
{
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetUserCreatorStatusQueryHandler(
        IUserRepository userRepository,
        ICurrentUserService currentUserService)
    {
        _userRepository = userRepository;
        _currentUserService = currentUserService;
    }

    public async Task<UserCreatorStatusDto> Handle(
        GetUserCreatorStatusQuery request,
        CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(_currentUserService.UserId!);
        var user = await _userRepository.GetByIdAsync(userId, cancellationToken);

        if (user == null)
        {
            throw new EntityNotFoundException(nameof(User), userId);
        }

        return new UserCreatorStatusDto
        {
            IsCreator = user.Role == RoleType.Creator || user.Role == RoleType.Administrator,
            IsAdmin = user.Role == RoleType.Administrator
        };
    }
}
