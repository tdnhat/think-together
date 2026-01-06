using Mapster;
using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.UserAggregate.Repositories;
using ThinkTogether.Domain.Exceptions;

namespace ThinkTogether.Application.Handlers.User.Commands.UpdateCurrentUserProfile;

public sealed class UpdateCurrentUserProfileCommandHandler : IRequestHandler<UpdateCurrentUserProfileCommand, UserDto>
{
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IFileUploadService _fileUploadService;

    public UpdateCurrentUserProfileCommandHandler(
        IUserRepository userRepository,
        ICurrentUserService currentUserService,
        IFileUploadService fileUploadService)
    {
        _userRepository = userRepository;
        _currentUserService = currentUserService;
        _fileUploadService = fileUploadService;
    }

    public async Task<UserDto> Handle(UpdateCurrentUserProfileCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        
        if (string.IsNullOrWhiteSpace(userId) || !Guid.TryParse(userId, out var userIdValue))
        {
            throw new UnauthorizedException("ID người dùng không hợp lệ");
        }

        var user = await _userRepository.GetByIdAsync(userIdValue, cancellationToken);
        
        if (user == null)
        {
            throw new EntityNotFoundException(nameof(Domain.Aggregates.UserAggregate.User), userIdValue);
        }

        // Clean up old avatar if new one is provided and different
        if (!string.IsNullOrEmpty(request.AvatarUrl) && 
            !string.IsNullOrEmpty(user.AvatarUrl) && 
            user.AvatarUrl != request.AvatarUrl)
        {
            try
            {
                await _fileUploadService.DeleteImageAsync(user.AvatarUrl, cancellationToken);
            }
            catch
            {
                // Ignore cleanup errors - old file may already be deleted or inaccessible
            }
        }

        user.UpdateProfile(request.FirstName, request.LastName, request.AvatarUrl, request.Bio);
        
        await _userRepository.UpdateAsync(user, cancellationToken);

        return user.Adapt<UserDto>();
    }
}
