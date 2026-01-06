using Mapster;
using MediatR;
using Microsoft.Extensions.Logging;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.ClassAggregate;
using ThinkTogether.Domain.Aggregates.ClassAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.UserAggregate.Repositories;
using ThinkTogether.Shared.Common;

namespace ThinkTogether.Application.Handlers.Class.Commands.UploadClassCover;

public sealed class UploadClassCoverCommandHandler : IRequestHandler<UploadClassCoverCommand, ClassDto>
{
    private readonly IClassRepository _repository;
    private readonly IUserRepository _userRepository;
    private readonly IFileUploadService _imageUploadService;
    private readonly ICurrentUserService _currentUserService;
    private readonly ILogger<UploadClassCoverCommandHandler> _logger;
    private readonly IUnitOfWork _unitOfWork;

    public UploadClassCoverCommandHandler(
        IClassRepository repository,
        IUserRepository userRepository,
        IFileUploadService imageUploadService,
        ICurrentUserService currentUserService,
        ILogger<UploadClassCoverCommandHandler> logger,
        IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _userRepository = userRepository;
        _imageUploadService = imageUploadService;
        _currentUserService = currentUserService;
        _logger = logger;
        _unitOfWork = unitOfWork;
    }

    public async Task<ClassDto> Handle(
        UploadClassCoverCommand request,
        CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(_currentUserService.UserId!);

        _logger.LogInformation("User {UserId} uploading cover image for class {ClassId}",
            userId, request.ClassId);

        // Get the class
        var classEnity = await _repository.GetByIdAsync(request.ClassId, cancellationToken);
        if (classEnity == null)
        {
            _logger.LogWarning("Class not found: {ClassId}", request.ClassId);
            throw new KeyNotFoundException($"Lớp học không tồn tại");
        }

        // Check if user is the teacher
        if (classEnity.TeacherId != userId)
        {
            _logger.LogWarning("User {UserId} attempted to upload image for class {ClassId} owned by {TeacherId}",
                userId, request.ClassId, classEnity.TeacherId);
            throw new UnauthorizedAccessException("Bạn không có quyền cập nhật lớp học này");
        }

        // Delete old image if it exists
        if (!string.IsNullOrEmpty(classEnity.CoverImageUrl))
        {
            _logger.LogInformation("Deleting old cover image: {ImageUrl}", classEnity.CoverImageUrl);
            try
            {
                await _imageUploadService.DeleteImageAsync(classEnity.CoverImageUrl, cancellationToken);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to delete old cover image for class {ClassId}",
                    request.ClassId);
                // Continue even if deletion fails
            }
        }

        // Upload new image
        _logger.LogInformation("Uploading new cover image for class {ClassId}", request.ClassId);
        var imageUrl = await _imageUploadService.UploadImageAsync(
            request.CoverImage,
            "classes/covers",
            cancellationToken);

        // Update class with new image URL
        classEnity.UpdateCoverImageUrl(imageUrl);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Cover image uploaded successfully for class {ClassId}. Image URL: {ImageUrl}",
            request.ClassId, imageUrl);

        var teacher = await _userRepository.GetByIdAsync(classEnity.TeacherId, cancellationToken);

        var dto = classEnity.Adapt<ClassDto>();
        dto.TeacherName = teacher != null ? $"{teacher.FirstName} {teacher.LastName}".Trim() : "Unknown Teacher";

        return dto;
    }
}
