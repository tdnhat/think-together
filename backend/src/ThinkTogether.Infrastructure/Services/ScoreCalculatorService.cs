using ThinkTogether.Domain.Aggregates.GamingAggregate.Services;

namespace ThinkTogether.Infrastructure.Services;

public class ScoreCalculatorService : IScoreCalculatorService
{
    public int CalculatePoints(bool isCorrect, int responseTimeMs, int timeLimitMs, int basePoints = 1000)
    {
        if (!isCorrect)
        {
            return 0;
        }

        if (responseTimeMs < 0)
        {
            responseTimeMs = 0;
        }

        if (responseTimeMs > timeLimitMs)
        {
            responseTimeMs = timeLimitMs;
        }

        // Calculate time factor (0.5 to 1.0 based on response time)
        var timeFactor = 1.0 - ((double)responseTimeMs / timeLimitMs) / 2;
        
        // Calculate points and round to nearest integer
        var points = (int)Math.Round(basePoints * timeFactor);

        // Ensure minimum points for correct answer
        return Math.Max(points, basePoints / 2);
    }
}

