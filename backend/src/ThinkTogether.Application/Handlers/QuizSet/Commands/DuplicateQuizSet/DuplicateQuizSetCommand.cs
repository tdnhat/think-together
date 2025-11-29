using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.QuizSet.Commands.DuplicateQuizSet;

public sealed record DuplicateQuizSetCommand(Guid QuizSetId) : IRequest<QuizSetDto>;
