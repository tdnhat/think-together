using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Domain.Enums;

namespace ThinkTogether.Application.Handlers.Leaderboard.Queries.GetLeaderboard;

public sealed record GetLeaderboardQuery(
    Guid? QuizSetId = null,
    Guid? ChallengeId = null,
    LeaderboardTimePeriod? TimePeriod = LeaderboardTimePeriod.All,
    LeaderboardSortBy? SortBy = LeaderboardSortBy.Score,
    string? SortOrder = "desc",
    int Page = 1,
    int PageSize = 20,
    bool? IsHomework = null, // Filter by homework vs public challenge
    Guid? ClassId = null, // Filter by class
    Guid? HomeworkId = null) : IRequest<LeaderboardDto>; // Filter by specific homework
