using ThinkTogether.Domain.Aggregates.GamingAggregate.Entities;

namespace ThinkTogether.Domain.Aggregates.GamingAggregate.Services;

public interface ILeaderboardService
{
    List<LeaderboardEntry> BuildLeaderboard(GameSession gameSession);
    List<LeaderboardEntry> BuildFinalLeaderboard(GameSession gameSession);
}

public record LeaderboardEntry(
    Guid PlayerId,
    string Nickname,
    int TotalPoints,
    int CorrectAnswers,
    int Rank,
    decimal AccuracyPercentage,
    long? TotalTimeSpentMs);

