using Shared.Primitives;

namespace Domain.Aggregates.GamingAggregate.Entities;

public sealed class PlayerAnswer : Entity
{
    private PlayerAnswer()
    {
    }

    public Guid Id { get; private set; }

    public Guid GamePlayerId { get; private set; }

    public Guid GameQuestionId { get; private set; }

    public bool IsCorrect { get; private set; }

    public int ResponseTimeMs { get; private set; }

    public int PointsEarned { get; private set; }

    public static PlayerAnswer Create(
        Guid gamePlayerId,
        Guid gameQuestionId,
        bool isCorrect,
        int responseTimeMs,
        int pointsEarned)
    {
        if (gamePlayerId == Guid.Empty)
            throw new ArgumentException("Game player ID cannot be empty", nameof(gamePlayerId));

        if (gameQuestionId == Guid.Empty)
            throw new ArgumentException("Game question ID cannot be empty", nameof(gameQuestionId));

        if (responseTimeMs < 0)
            throw new ArgumentException("Response time cannot be negative", nameof(responseTimeMs));

        if (pointsEarned < 0)
            throw new ArgumentException("Points cannot be negative", nameof(pointsEarned));

        return new PlayerAnswer
        {
            Id = Guid.NewGuid(),
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

