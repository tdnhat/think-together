using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.Leaderboard.Queries.GetLeaderboardStats;

public sealed record GetLeaderboardStatsQuery(
    Guid? QuizSetId = null,
    Guid? ChallengeId = null,
    string? TimePeriod = null) : IRequest<LeaderboardStatsDto>;
