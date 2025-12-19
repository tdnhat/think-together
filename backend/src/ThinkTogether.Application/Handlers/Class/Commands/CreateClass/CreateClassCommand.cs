using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.Class.Commands.CreateClass;

public sealed record CreateClassCommand(
    string Name,
    string? Description = null,
    string? CoverImageUrl = null) : IRequest<ClassDto>;
