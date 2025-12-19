using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Repositories;
using ThinkTogether.Domain.Enums;
using ThinkTogether.Domain.Exceptions;

namespace ThinkTogether.Application.Handlers.Challenge.Queries.GetChallengeStats;

public sealed class GetChallengeStatsQueryHandler : IRequestHandler<GetChallengeStatsQuery, ChallengeStatsDto>
{
    private readonly IChallengeRepository _challengeRepository;

    public GetChallengeStatsQueryHandler(IChallengeRepository challengeRepository)
    {
        _challengeRepository = challengeRepository;
    }

    public async Task<ChallengeStatsDto> Handle(GetChallengeStatsQuery request, CancellationToken cancellationToken)
    {
        var challenge = await _challengeRepository.GetByIdAsync(request.ChallengeId, cancellationToken)
            ?? throw new EntityNotFoundException("Thử thách", request.ChallengeId);

        var allAttempts = challenge.Attempts
            .Where(a => a.DeletedAt == null)
            .ToList();

        var completedAttempts = allAttempts
            .Where(a => a.Status == AttemptStatus.Completed)
            .ToList();

        var totalAttempts = allAttempts.Count;
        var completedCount = completedAttempts.Count;

        // Calculate unique participants (from userId)
        var uniqueParticipants = completedAttempts
            .Where(a => a.UserId.HasValue)
            .Select(a => a.UserId!.Value)
            .Distinct()
            .Count();

        // If no userIds, count by nickname (for anonymous attempts)
        var participantsWithoutUserId = completedAttempts
            .Where(a => !a.UserId.HasValue)
            .Select(a => a.Nickname)
            .Distinct()
            .Count();

        var totalParticipants = uniqueParticipants + participantsWithoutUserId;

        // Calculate average score
        var averageScore = completedCount > 0
            ? completedAttempts.Average(a => a.ScoreAchieved)
            : 0.0;

        // Calculate average accuracy
        var averageAccuracy = completedCount > 0
            ? completedAttempts
                .Where(a => a.TotalQuestions > 0)
                .Average(a => (double)a.CorrectAnswers / a.TotalQuestions * 100)
            : 0.0;

        // Calculate completion rate
        var completionRate = totalAttempts > 0
            ? (double)completedCount / totalAttempts * 100
            : 0.0;

        // Get top score
        var topScore = completedCount > 0
            ? completedAttempts.Max(a => a.ScoreAchieved)
            : 0;

        // Calculate recent activity (last 7 days)
        var sevenDaysAgo = DateTime.UtcNow.AddDays(-7);
        var recentActivityCount = allAttempts
            .Count(a => a.StartedAt >= sevenDaysAgo);

        return new ChallengeStatsDto
        {
            ChallengeId = challenge.Id,
            TotalAttempts = totalAttempts,
            CompletedAttempts = completedCount,
            TotalParticipants = totalParticipants,
            AverageScore = Math.Round(averageScore, 2),
            AverageAccuracy = Math.Round(averageAccuracy, 2),
            CompletionRate = Math.Round(completionRate, 2),
            TopScore = topScore,
            RecentActivityCount = recentActivityCount,
        };
    }
}
