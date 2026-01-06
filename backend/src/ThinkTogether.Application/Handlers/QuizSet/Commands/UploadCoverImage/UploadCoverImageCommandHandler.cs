using Mapster;
using MediatR;
using Microsoft.Extensions.Logging;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.UserAggregate.Repositories;
using ThinkTogether.Shared.Common;

namespace ThinkTogether.Application.Handlers.QuizSet.Commands.UploadCoverImage;

public sealed class UploadCoverImageCommandHandler : IRequestHandler<UploadCoverImageCommand, QuizSetDto>
{
    private readonly IQuizSetRepository _repository;
    private readonly IUserRepository _userRepository;
    private readonly IFileUploadService _imageUploadService;
    private readonly ICurrentUserService _currentUserService;
    private readonly ILogger<UploadCoverImageCommandHandler> _logger;
    private readonly IUnitOfWork _unitOfWork;

    public UploadCoverImageCommandHandler(
        IQuizSetRepository repository,
        IUserRepository userRepository,
        IFileUploadService imageUploadService,
        ICurrentUserService currentUserService,
        ILogger<UploadCoverImageCommandHandler> logger,
        IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _userRepository = userRepository;
        _imageUploadService = imageUploadService;
        _currentUserService = currentUserService;
        _logger = logger;
        _unitOfWork = unitOfWork;
    }

    public async Task<QuizSetDto> Handle(
        UploadCoverImageCommand request,
        CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(_currentUserService.UserId!);

        _logger.LogInformation("User {UserId} uploading cover image for quiz set {QuizSetId}",
            userId, request.QuizSetId);

        // Get the quiz set
        var quizSet = await _repository.GetByIdAsync(request.QuizSetId, cancellationToken);
        if (quizSet == null)
        {
            _logger.LogWarning("Quiz set not found: {QuizSetId}", request.QuizSetId);
            throw new KeyNotFoundException($"Bộ trắc nghiệm không tồn tại");
        }

        // Check if user is the creator
        if (quizSet.CreatorId != userId)
        {
            _logger.LogWarning("User {UserId} attempted to upload image for quiz set {QuizSetId} created by {CreatorId}",
                userId, request.QuizSetId, quizSet.CreatorId);
            throw new UnauthorizedAccessException("Bạn không có quyền cập nhật bộ trắc nghiệm này");
        }

        // Delete old image if it exists
        if (!string.IsNullOrEmpty(quizSet.CoverImageUrl))
        {
            _logger.LogInformation("Deleting old cover image: {ImageUrl}", quizSet.CoverImageUrl);
            try
            {
                await _imageUploadService.DeleteImageAsync(quizSet.CoverImageUrl, cancellationToken);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to delete old cover image for quiz set {QuizSetId}",
                    request.QuizSetId);
                // Continue even if deletion fails
            }
        }

        // Upload new image
        _logger.LogInformation("Uploading new cover image for quiz set {QuizSetId}", request.QuizSetId);
        var imageUrl = await _imageUploadService.UploadImageAsync(
            request.CoverImage,
            "quiz-sets/covers",
            cancellationToken);

        // Update quiz set with new image URL
        quizSet.UpdateCoverImageUrl(imageUrl);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Cover image uploaded successfully for quiz set {QuizSetId}. Image URL: {ImageUrl}",
            request.QuizSetId, imageUrl);

        var creator = await _userRepository.GetByIdAsync(quizSet.CreatorId, cancellationToken);

        var dto = quizSet.Adapt<QuizSetDto>();
        dto.CreatorName = creator != null ? $"{creator.FirstName} {creator.LastName}".Trim() : "Unknown Creator";

        return dto;
    }
}
