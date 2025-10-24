using Shared.Primitives;

namespace Domain.Aggregates.QuizSetAggregate.Entities;

public sealed class QuestionStatistics : Entity
{
    // Private constructor for EF Core
    private QuestionStatistics()
    {
    }

    public Guid Id { get; private set; }

    public Guid GameSessionId { get; private set; }

    public Guid QuestionId { get; private set; }

    public int CorrectCount { get; private set; }

    public int IncorrectCount { get; private set; }

    public double AverageResponseTimeSeconds { get; private set; }

    public double DifficultyPercentage { get; private set; } // 100 - accuracy percentage

    public string? MostSelectedAnswer { get; private set; }

    public static QuestionStatistics Create(
        Guid gameSessionId,
        Guid questionId)
    {
        return new QuestionStatistics
        {
            Id = Guid.NewGuid(),
            GameSessionId = gameSessionId,
            QuestionId = questionId,
            CorrectCount = 0,
            IncorrectCount = 0,
            AverageResponseTimeSeconds = 0.0,
            DifficultyPercentage = 0.0,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    public void RecordAnswer(bool isCorrect, double responseTimeSeconds, string? selectedAnswer = null)
    {
        if (isCorrect)
            CorrectCount++;
        else
            IncorrectCount++;

        // Update average response time
        int totalAnswers = CorrectCount + IncorrectCount;
        AverageResponseTimeSeconds = ((AverageResponseTimeSeconds * (totalAnswers - 1)) + responseTimeSeconds) / totalAnswers;

        // Update difficulty percentage (100 - accuracy)
        double accuracy = totalAnswers > 0 ? (double)CorrectCount / totalAnswers * 100 : 0;
        DifficultyPercentage = 100 - accuracy;

        // Update most selected answer (simplified - just track the last one for now)
        if (!string.IsNullOrEmpty(selectedAnswer))
            MostSelectedAnswer = selectedAnswer;
    }
}
