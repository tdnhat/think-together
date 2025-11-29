using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.QuizSet.Queries.GetQuizSetById;

public sealed record GetQuizSetByIdQuery(Guid Id) : IRequest<QuizSetDto>;
