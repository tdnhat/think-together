using ThinkTogether.Domain.Exceptions;

namespace ThinkTogether.Domain.Aggregates.GamingAggregate.Entities;

public sealed partial class GameQuestion
{
    public void RecordAnswer(bool isCorrect, int responseTimeMs)
    {
        if (responseTimeMs < 0)
            throw new ValidationException("Thời gian phản hồi không được âm");

        if (isCorrect)
            CorrectAnswerCount++;
        else
            WrongAnswerCount++;

        var totalAnswers = CorrectAnswerCount + WrongAnswerCount;
        var totalTime = (AverageResponseTimeMs * (totalAnswers - 1)) + responseTimeMs;
        AverageResponseTimeMs = totalTime / totalAnswers;

        UpdatedAt = DateTime.UtcNow;
    }
}
