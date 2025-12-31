using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Domain.Enums;

namespace ThinkTogether.Application.Handlers.Leaderboard.Queries.GetLeaderboardStats;

public sealed record GetLeaderboardStatsQuery(
    Guid? QuizSetId = null,
    Guid? ChallengeId = null,
    LeaderboardTimePeriod? TimePeriod = LeaderboardTimePeriod.All) : IRequest<LeaderboardStatsDto>;
