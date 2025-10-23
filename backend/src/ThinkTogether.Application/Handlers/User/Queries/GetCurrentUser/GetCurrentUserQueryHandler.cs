using Application.DTOs;
using Application.Services;
using Domain.Aggregates.UserAggregate.Repositories;
using Domain.Exceptions;
using MediatR;
using Mapster;

namespace Application.Handlers.User.Queries.GetCurrentUser;

public sealed class GetCurrentUserQueryHandler : IRequestHandler<GetCurrentUserQuery, UserDto>
{
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetCurrentUserQueryHandler(
        IUserRepository userRepository,
        ICurrentUserService currentUserService)
    {
        _userRepository = userRepository;
        _currentUserService = currentUserService;
    }

    public async Task<UserDto> Handle(GetCurrentUserQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;

        if (string.IsNullOrWhiteSpace(userId) || !Guid.TryParse(userId, out var userIdValue))
        {
            throw new UnauthorizedException("ID nguoi dung khong hop le");
        }

        var user = await _userRepository.GetByIdAsync(userIdValue, cancellationToken);

        if (user == null || user.IsDeleted)
        {
            throw new UnauthorizedException("Khong tim thay nguoi dung");
        }

        return user.Adapt<UserDto>();
    }
}
