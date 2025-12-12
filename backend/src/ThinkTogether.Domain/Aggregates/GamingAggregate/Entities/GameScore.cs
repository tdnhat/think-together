using ThinkTogether.Domain.Exceptions;
using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.GamingAggregate.Entities;

public sealed partial class GameScore : Entity
{
    private GameScore()
    {
    }

    public Guid Id { get; private set; }

    public Guid GameSessionId { get; private set; }

    public Guid GamePlayerId { get; private set; }

    public int TotalPoints { get; private set; }

    public int? FinalRank { get; private set; }

    public int CorrectAnswers { get; private set; }

    public int TotalQuestions { get; private set; }

    public decimal AccuracyPercentage { get; private set; }

    public static GameScore Create(
        Guid gameSessionId,
        Guid gamePlayerId,
        int totalQuestions)
    {
        if (gameSessionId == Guid.Empty)
            throw new ValidationException("ID phiên trò chơi không được trống");

        if (gamePlayerId == Guid.Empty)
            throw new ValidationException("ID người chơi trò chơi không được trống");

        if (totalQuestions < 0)
            throw new ValidationException("Tổng số câu hỏi không được âm");

        return new GameScore
        {
            Id = Guid.NewGuid(),
            GameSessionId = gameSessionId,
            GamePlayerId = gamePlayerId,
            TotalPoints = 0,
            FinalRank = null,
            CorrectAnswers = 0,
            TotalQuestions = totalQuestions,
            AccuracyPercentage = 0,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }
}
