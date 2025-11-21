using Shared.Primitives;

namespace Domain.Aggregates.QuizAggregate.Entities;

public sealed class QuestionStatistic : Entity
{
    private QuestionStatistic()
    {
    }

    public Guid Id { get; private set; }

    public Guid QuestionId { get; private set; }

    public int TimesAsked { get; private set; }

    public int CorrectAnswers { get; private set; }

    public int WrongAnswers { get; private set; }

    public int AverageResponseTimeMs { get; private set; }

    public decimal Difficulty { get; private set; }

    public static QuestionStatistic Create(Guid questionId)
    {
        if (questionId == Guid.Empty)
            throw new ArgumentException("Question ID cannot be empty", nameof(questionId));

        return new QuestionStatistic
        {
            Id = Guid.NewGuid(),
            QuestionId = questionId,
            TimesAsked = 0,
            CorrectAnswers = 0,
            WrongAnswers = 0,
            AverageResponseTimeMs = 0,
            Difficulty = 0,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    public void RecordAttempt(bool isCorrect, int responseTimeMs)
    {
        if (responseTimeMs < 0)
            throw new ArgumentException("Response time cannot be negative", nameof(responseTimeMs));

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

