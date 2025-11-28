using Domain.Exceptions;
using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.QuizSetAggregate.Entities;

public sealed partial class QuestionStatistic : Entity
{
    public void RecordAttempt(bool isCorrect, int responseTimeMs)
    {
        if (responseTimeMs < 0)
            throw new ValidationException("Thời gian phản hồi không được âm");

        TimesAsked++;

        if (isCorrect)
            CorrectAnswers++;
        else
            WrongAnswers++;

        // Calculate average response time
        var totalTime = (AverageResponseTimeMs * (TimesAsked - 1)) + responseTimeMs;
        AverageResponseTimeMs = (int)(totalTime / TimesAsked);

        // Calculate difficulty (0-100): percentage of wrong answers
        if (TimesAsked > 0)
        {
            Difficulty = (decimal)WrongAnswers / TimesAsked * 100;
        }

        UpdatedAt = DateTime.UtcNow;
    }
}
