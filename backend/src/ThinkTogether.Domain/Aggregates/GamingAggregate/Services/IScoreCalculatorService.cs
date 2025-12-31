namespace ThinkTogether.Domain.Aggregates.GamingAggregate.Services;

public interface IScoreCalculatorService
{
    int CalculatePoints(bool isCorrect, int responseTimeMs, int timeLimitMs, int basePoints = 1000);
}

