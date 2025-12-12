using ThinkTogether.Domain.Aggregates.GamingAggregate;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Services;

namespace ThinkTogether.Infrastructure.Services;

public class LeaderboardService : ILeaderboardService
{
    public List<LeaderboardEntry> BuildLeaderboard(GameSession gameSession)
    {
        var rankedScores = gameSession.Scores
            .OrderByDescending(s => s.TotalPoints)
            .ThenByDescending(s => s.CorrectAnswers)
            .ToList();

        return rankedScores
            .Select((score, index) =>
            {
                var player = gameSession.Players.FirstOrDefault(p => p.Id == score.GamePlayerId);
                var totalTimeMs = CalculateTotalTimeSpent(gameSession, score.GamePlayerId);

                return new LeaderboardEntry(
                    PlayerId: score.GamePlayerId,
                    Nickname: player?.Nickname ?? "Unknown",
                    TotalPoints: score.TotalPoints,
                    CorrectAnswers: score.CorrectAnswers,
                    Rank: index + 1,
                    AccuracyPercentage: score.AccuracyPercentage,
                    TotalTimeSpentMs: totalTimeMs > 0 ? totalTimeMs : null);
            })
            .ToList();
    }

    public List<LeaderboardEntry> BuildFinalLeaderboard(GameSession gameSession)
    {
        return gameSession.Scores
            .OrderBy(s => s.FinalRank)
            .Select(score =>
            {
                var player = gameSession.Players.FirstOrDefault(p => p.Id == score.GamePlayerId);
                var totalTimeMs = CalculateTotalTimeSpent(gameSession, score.GamePlayerId);

                return new LeaderboardEntry(
                    PlayerId: score.GamePlayerId,
                    Nickname: player?.Nickname ?? "Unknown",
                    TotalPoints: score.TotalPoints,
                    CorrectAnswers: score.CorrectAnswers,
                    Rank: score.FinalRank ?? 0,
                    AccuracyPercentage: score.AccuracyPercentage,
                    TotalTimeSpentMs: totalTimeMs > 0 ? totalTimeMs : null);
            })
            .ToList();
    }

    private static long CalculateTotalTimeSpent(GameSession gameSession, Guid playerId)
    {
        return gameSession.PlayerAnswers
            .Where(pa => pa.GamePlayerId == playerId)
            .Sum(pa => (long)pa.ResponseTimeMs);
    }
}

