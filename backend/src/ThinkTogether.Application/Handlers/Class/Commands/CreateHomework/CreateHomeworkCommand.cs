using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.Class.Commands.CreateHomework;

public sealed record CreateHomeworkCommand(
    Guid ClassId,
    Guid QuizSetId,
    string Title,
    DateTime? DueDate = null) : IRequest<HomeworkDto>;
