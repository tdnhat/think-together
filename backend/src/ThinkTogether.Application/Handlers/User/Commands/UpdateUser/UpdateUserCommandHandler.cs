using Mapster;
using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Domain.Aggregates.UserAggregate.Repositories;
using ThinkTogether.Domain.Exceptions;

namespace ThinkTogether.Application.Handlers.User.Commands.UpdateUser;

public sealed class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, UserDto>
{
    private readonly IUserRepository _userRepository;

    public UpdateUserCommandHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<UserDto> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.Id, cancellationToken);
        
        if (user == null)
        {
            throw new EntityNotFoundException(nameof(Domain.Aggregates.UserAggregate.User), request.Id);
        }

        user.UpdateDetails(request.FirstName, request.LastName, request.Bio, request.Role);
        
        await _userRepository.UpdateAsync(user, cancellationToken);

        return user.Adapt<UserDto>();
    }
}
