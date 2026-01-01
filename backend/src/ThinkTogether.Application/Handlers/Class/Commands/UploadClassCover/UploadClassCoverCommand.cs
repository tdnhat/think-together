using MediatR;
using Microsoft.AspNetCore.Http;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.Class.Commands.UploadClassCover;

public sealed record UploadClassCoverCommand(
    Guid ClassId,
    IFormFile CoverImage) : IRequest<ClassDto>;
