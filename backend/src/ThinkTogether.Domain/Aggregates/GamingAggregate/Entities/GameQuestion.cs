using Domain.Exceptions;
using Shared.Primitives;

namespace Domain.Aggregates.GamingAggregate.Entities;

public sealed class GameQuestion : Entity
{
    private GameQuestion()
    {
    }

    public Guid Id { get; private set; }

    public Guid GameSessionId { get; private set; }

    public Guid QuestionId { get; private set; }

    public int PositionInGame { get; private set; }

    public int CorrectAnswerCount { get; private set; }

    public int WrongAnswerCount { get; private set; }

    public decimal AverageResponseTimeMs { get; private set; }

    public static GameQuestion Create(Guid gameSessionId, Guid questionId, int positionInGame)
    {
        if (gameSessionId == Guid.Empty)
            throw new ValidationException("ID phiên trò chơi không được trống");

        if (questionId == Guid.Empty)
            throw new ValidationException("ID câu hỏi không được trống");

        if (positionInGame < 0)
            throw new ValidationException("Vị trí không được âm");

        return new GameQuestion
        {
            Id = Guid.NewGuid(),
            GameSessionId = gameSessionId,
            QuestionId = questionId,
            PositionInGame = positionInGame,
            CorrectAnswerCount = 0,
            WrongAnswerCount = 0,
            AverageResponseTimeMs = 0,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    public void RecordAnswer(bool isCorrect, int responseTimeMs)
    {
        if (responseTimeMs < 0)
            throw new ValidationException("Thời gian phản hồi không được âm");

        if (isCorrect)
            CorrectAnswerCount++;
        else
            WrongAnswerCount++;

        // Calculate running average
        var totalAnswers = CorrectAnswerCount + WrongAnswerCount;
        var totalTime = (AverageResponseTimeMs * (totalAnswers - 1)) + responseTimeMs;
        AverageResponseTimeMs = totalTime / totalAnswers;

        UpdatedAt = DateTime.UtcNow;
    }
}

