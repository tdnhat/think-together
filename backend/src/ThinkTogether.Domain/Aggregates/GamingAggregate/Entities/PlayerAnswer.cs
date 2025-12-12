using ThinkTogether.Domain.Exceptions;
using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.GamingAggregate.Entities;

public sealed class PlayerAnswer : Entity
{
    private PlayerAnswer()
    {
    }

    public Guid Id { get; private set; }

    public Guid GameSessionId { get; private set; }

    public Guid GamePlayerId { get; private set; }

    public Guid GameQuestionId { get; private set; }

    public bool IsCorrect { get; private set; }

    public int ResponseTimeMs { get; private set; }

    public int PointsEarned { get; private set; }

    public static PlayerAnswer Create(
        Guid gameSessionId,
        Guid gamePlayerId,
        Guid gameQuestionId,
        bool isCorrect,
        int responseTimeMs,
        int pointsEarned)
    {
        if (gameSessionId == Guid.Empty)
            throw new ValidationException("ID phiên trò chơi không được trống");

        if (gamePlayerId == Guid.Empty)
            throw new ValidationException("ID người chơi trò chơi không được trống");

        if (gameQuestionId == Guid.Empty)
            throw new ValidationException("ID câu hỏi trò chơi không được trống");

        if (responseTimeMs < 0)
            throw new ValidationException("Thời gian phản hồi không được âm");

        if (pointsEarned < 0)
            throw new ValidationException("Điểm kiếm được không được âm");

        return new PlayerAnswer
        {
            Id = Guid.NewGuid(),
            GameSessionId = gameSessionId,
            GamePlayerId = gamePlayerId,
            GameQuestionId = gameQuestionId,
            IsCorrect = isCorrect,
            ResponseTimeMs = responseTimeMs,
            PointsEarned = pointsEarned,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }
}
