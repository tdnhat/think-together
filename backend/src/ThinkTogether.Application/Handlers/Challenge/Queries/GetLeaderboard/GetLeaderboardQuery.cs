using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.Challenge.Queries.GetLeaderboard;

public sealed record GetLeaderboardQuery(
    Guid ChallengeId,
    int Page = 1,
    int PageSize = 50) : IRequest<ChallengeLeaderboardDto>;
