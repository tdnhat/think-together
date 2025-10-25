using Shared.Primitives;

namespace Domain.Aggregates.GameSessionAggregate.Entities;

public sealed class GameQuestion : Entity
{
    // Private constructor for EF Core
    private GameQuestion()
    {
    }

    public Guid Id { get; private set; }

    public Guid GameSessionId { get; private set; }

    public Guid QuestionId { get; private set; }

    public int PositionInGame { get; private set; }

    public int CorrectAnswerCount { get; private set; }

    public int IncorrectAnswerCount { get; private set; }

    public double AverageResponseTimeSeconds { get; private set; }

    public static GameQuestion Create(
        Guid gameSessionId,
        Guid questionId,
        int positionInGame)
    {
        if (positionInGame < 1)
            throw new Exceptions.ValidationException("Vị trí trong game phải lớn hơn 0");

        return new GameQuestion
        {
            Id = Guid.NewGuid(),
            GameSessionId = gameSessionId,
            QuestionId = questionId,
            PositionInGame = positionInGame,
            CorrectAnswerCount = 0,
            IncorrectAnswerCount = 0,
            AverageResponseTimeSeconds = 0.0,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    public void RecordAnswer(bool isCorrect, double responseTimeSeconds)
    {
        if (isCorrect)
            CorrectAnswerCount++;
        else
            IncorrectAnswerCount++;

        // Recalculate average response time
        int totalAnswers = CorrectAnswerCount + IncorrectAnswerCount;
        AverageResponseTimeSeconds = ((AverageResponseTimeSeconds * (totalAnswers - 1)) + responseTimeSeconds) / totalAnswers;
    }
}
