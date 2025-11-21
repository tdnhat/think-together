using Shared.Primitives;

namespace Domain.Aggregates.GamingAggregate.Entities;

public sealed class GameScore : Entity
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
            throw new ArgumentException("Game session ID cannot be empty", nameof(gameSessionId));

        if (gamePlayerId == Guid.Empty)
            throw new ArgumentException("Game player ID cannot be empty", nameof(gamePlayerId));

        if (totalQuestions < 0)
            throw new ArgumentException("Total questions cannot be negative", nameof(totalQuestions));

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

    public void AddPoints(int points)
    {
        if (points < 0)
            throw new ArgumentException("Points cannot be negative", nameof(points));

        TotalPoints += points;
        UpdatedAt = DateTime.UtcNow;
    }

    public void RecordCorrectAnswer()
    {
        if (CorrectAnswers >= TotalQuestions)
            throw new InvalidOperationException("Cannot exceed total questions");

        CorrectAnswers++;
        CalculateAccuracy();
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetFinalRank(int rank)
    {
        if (rank <= 0)
            throw new ArgumentException("Rank must be positive", nameof(rank));

        FinalRank = rank;
        UpdatedAt = DateTime.UtcNow;
    }

    private void CalculateAccuracy()
    {
        if (TotalQuestions > 0)
        {
            AccuracyPercentage = (decimal)CorrectAnswers / TotalQuestions * 100;
        }
    }
}

