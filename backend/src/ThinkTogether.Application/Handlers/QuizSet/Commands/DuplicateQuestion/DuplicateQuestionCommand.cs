using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.QuizSet.Commands.DuplicateQuestion;

public sealed record DuplicateQuestionCommand(
    Guid QuizSetId,
    Guid QuestionId) : IRequest<QuestionDto>;
