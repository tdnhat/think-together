using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.QuizSet.Queries.GetQuestionById;

public sealed record GetQuestionByIdQuery(
    Guid QuizSetId,
    Guid QuestionId) : IRequest<QuestionDto>;

