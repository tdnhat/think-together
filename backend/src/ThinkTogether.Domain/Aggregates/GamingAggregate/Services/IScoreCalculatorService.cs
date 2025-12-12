namespace ThinkTogether.Domain.Aggregates.GamingAggregate.Services;

public interface IScoreCalculatorService
{
    /// <summary>
    /// Calculate points for an answer based on correctness and response time.
    /// </summary>
    /// <param name="isCorrect">Whether the answer was correct</param>
    /// <param name="responseTimeMs">Time taken to answer in milliseconds</param>
    /// <param name="timeLimitMs">Maximum time allowed for the question in milliseconds</param>
    /// <param name="basePoints">Base points for a correct answer (default: 1000)</param>
    /// <returns>Points earned for the answer</returns>
    int CalculatePoints(bool isCorrect, int responseTimeMs, int timeLimitMs, int basePoints = 1000);
}

