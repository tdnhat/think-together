using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.Challenge.Queries.GetChallengeByQuizSetId;

public sealed record GetChallengeByQuizSetIdQuery(Guid QuizSetId) : IRequest<ChallengeDto?>;

