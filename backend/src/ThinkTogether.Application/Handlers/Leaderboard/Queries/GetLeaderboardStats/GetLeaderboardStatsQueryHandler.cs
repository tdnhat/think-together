using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Repositories;
using ThinkTogether.Domain.Enums;

namespace ThinkTogether.Application.Handlers.Leaderboard.Queries.GetLeaderboardStats;

public sealed class GetLeaderboardStatsQueryHandler : IRequestHandler<GetLeaderboardStatsQuery, LeaderboardStatsDto>
{
    private readonly IChallengeRepository _challengeRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetLeaderboardStatsQueryHandler(
        IChallengeRepository challengeRepository,
        ICurrentUserService currentUserService)
    {
        _challengeRepository = challengeRepository;
        _currentUserService = currentUserService;
    }

    public async Task<LeaderboardStatsDto> Handle(GetLeaderboardStatsQuery request, CancellationToken cancellationToken)
    {
        // Calculate cutoff date for time period filter
        DateTime? startedAfter = null;
        if (request.TimePeriod.HasValue && request.TimePeriod != LeaderboardTimePeriod.All)
        {
            startedAfter = request.TimePeriod switch
            {
                LeaderboardTimePeriod.Today => DateTime.UtcNow.Date,
                LeaderboardTimePeriod.Week => DateTime.UtcNow.AddDays(-7),
                LeaderboardTimePeriod.Month => DateTime.UtcNow.AddMonths(-1),
                _ => null
            };
        }

        // Get all attempts using repository method
        var allAttempts = await _challengeRepository.GetAttemptsWithChallengesAsync(
            quizSetId: request.QuizSetId,
            challengeId: request.ChallengeId,
            startedAfter: startedAfter,
            cancellationToken: cancellationToken);

        // Get completed attempts
        var completedAttempts = allAttempts
            .Where(a => a.Status == AttemptStatus.Completed)
            .ToList();

        // Apply time period filter for completed attempts (if not already filtered)
        // Apply time period filter for completed attempts (if not already filtered)
        if (request.TimePeriod.HasValue && request.TimePeriod != LeaderboardTimePeriod.All)
        {
            var cutoffDate = request.TimePeriod switch
            {
                LeaderboardTimePeriod.Today => DateTime.UtcNow.Date,
                LeaderboardTimePeriod.Week => DateTime.UtcNow.AddDays(-7),
                LeaderboardTimePeriod.Month => DateTime.UtcNow.AddMonths(-1),
                _ => DateTime.MinValue
            };

            completedAttempts = completedAttempts
                .Where(a => a.CompletedAt >= cutoffDate)
                .ToList();
        }

        // Calculate statistics
        var totalAttempts = allAttempts.Count;
        var totalCompletedAttempts = completedAttempts.Count;
        var totalParticipants = completedAttempts
            .Select(a => a.UserId ?? Guid.Empty)
            .Distinct()
            .Count(p => p != Guid.Empty);

        var averageScore = completedAttempts.Any()
            ? completedAttempts.Average(a => a.ScoreAchieved)
            : 0;

        var averageAccuracy = completedAttempts.Any()
            ? completedAttempts.Average(a => a.TotalQuestions > 0
                ? (double)a.CorrectAnswers / a.TotalQuestions * 100
                : 0)
            : 0;

        var averageCompletionTimeMs = completedAttempts
            .Where(a => a.CompletionTimeMs.HasValue)
            .Select(a => a.CompletionTimeMs!.Value)
            .DefaultIfEmpty(0)
            .Average();

        var completionRate = totalAttempts > 0
            ? (double)totalCompletedAttempts / totalAttempts * 100
            : 0;

        var topScore = completedAttempts.Any()
            ? completedAttempts.Max(a => a.ScoreAchieved)
            : 0;

        // Recent activity (last 24 hours)
        var recentCutoff = DateTime.UtcNow.AddHours(-24);
        var recentActivityCount = completedAttempts
            .Count(a => a.CompletedAt >= recentCutoff);

        return new LeaderboardStatsDto
        {
            TotalAttempts = totalAttempts,
            TotalParticipants = totalParticipants,
            AverageScore = Math.Round(averageScore, 2),
            AverageAccuracy = Math.Round(averageAccuracy, 2),
            AverageCompletionTimeMs = averageCompletionTimeMs > 0 ? (int)averageCompletionTimeMs : null,
            CompletionRate = Math.Round(completionRate, 2),
            TopScore = topScore,
            RecentActivityCount = recentActivityCount
        };
    }
}
