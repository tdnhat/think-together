using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.Challenge.Queries.GetChallengeAttempt;

public sealed record GetChallengeAttemptQuery(Guid AttemptId) : IRequest<ChallengeAttemptDto>;
