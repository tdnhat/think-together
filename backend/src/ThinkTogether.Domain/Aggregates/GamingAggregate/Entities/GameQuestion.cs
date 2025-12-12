using ThinkTogether.Domain.Exceptions;
using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.GamingAggregate.Entities;

public sealed partial class GameQuestion : Entity
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
}
