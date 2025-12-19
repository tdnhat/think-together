using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.Leaderboard.Queries.GetLeaderboard;

public sealed record GetLeaderboardQuery(
    Guid? QuizSetId = null,
    Guid? ChallengeId = null,
    string? TimePeriod = null, // "today", "week", "month", "all"
    string? SortBy = null, // "score", "accuracy", "time", "completedAt"
    string? SortOrder = null, // "asc", "desc"
    int Page = 1,
    int PageSize = 20) : IRequest<LeaderboardDto>;
