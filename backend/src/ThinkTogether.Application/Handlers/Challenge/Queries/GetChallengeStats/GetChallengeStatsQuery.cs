using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.Challenge.Queries.GetChallengeStats;

public sealed record GetChallengeStatsQuery(Guid ChallengeId) : IRequest<ChallengeStatsDto>;
