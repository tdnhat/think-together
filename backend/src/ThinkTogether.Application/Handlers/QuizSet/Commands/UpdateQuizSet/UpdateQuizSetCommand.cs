using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.QuizSet.Commands.UpdateQuizSet;

public sealed record UpdateQuizSetCommand(
    Guid Id,
    string? Title,
    string? Description,
    string? CoverImageUrl,
    Guid? CategoryId = null) : IRequest<QuizSetDto>;
