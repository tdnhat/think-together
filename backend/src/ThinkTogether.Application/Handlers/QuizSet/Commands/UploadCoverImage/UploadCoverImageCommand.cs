using Microsoft.AspNetCore.Http;
using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.QuizSet.Commands.UploadCoverImage;

public sealed record UploadCoverImageCommand(
    Guid QuizSetId,
    IFormFile CoverImage) : IRequest<QuizSetDto>;
