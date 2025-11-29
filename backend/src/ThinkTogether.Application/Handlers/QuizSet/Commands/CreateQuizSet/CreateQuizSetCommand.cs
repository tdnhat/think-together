using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.QuizSet.Commands.CreateQuizSet;

public sealed record CreateQuizSetCommand(
    string Title,
    string? Description = null,
    string? CoverImageUrl = null) : IRequest<QuizSetDto>;

