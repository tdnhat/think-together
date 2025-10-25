using Shared.Primitives;

namespace Domain.Aggregates.GameSessionAggregate.Entities;

public sealed class GameScore : Entity
{
    // Private constructor for EF Core
    private GameScore()
    {
    }

    public Guid Id { get; private set; }

    public Guid PlayerId { get; private set; }

    public Guid GameSessionId { get; private set; }

    public int TotalScore { get; private set; }

    public int FinalRank { get; private set; }

    public int CorrectAnswers { get; private set; }

    public int TotalQuestions { get; private set; }

    public double AccuracyPercentage { get; private set; }

    public static GameScore Create(
        Guid playerId,
        Guid gameSessionId,
        int totalScore,
        int finalRank,
        int correctAnswers,
        int totalQuestions)
    {
        if (totalScore < 0)
            throw new Domain.Exceptions.ValidationException("Tổng điểm không được âm");

        if (finalRank < 1)
            throw new Domain.Exceptions.ValidationException("Thứ hạng phải lớn hơn 0");

        if (correctAnswers < 0)
            throw new Domain.Exceptions.ValidationException("Số câu trả lời đúng không được âm");

        if (totalQuestions < 0)
            throw new Domain.Exceptions.ValidationException("Tổng số câu hỏi không được âm");

        if (correctAnswers > totalQuestions)
            throw new Domain.Exceptions.ValidationException("Số câu đúng không thể lớn hơn tổng số câu hỏi");

        double accuracyPercentage = totalQuestions > 0 ? (double)correctAnswers / totalQuestions * 100 : 0;

        return new GameScore
        {
            Id = Guid.NewGuid(),
            PlayerId = playerId,
            GameSessionId = gameSessionId,
            TotalScore = totalScore,
            FinalRank = finalRank,
            CorrectAnswers = correctAnswers,
            TotalQuestions = totalQuestions,
            AccuracyPercentage = accuracyPercentage,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    public void UpdateRank(int newRank)
    {
        if (newRank < 1)
            throw new Domain.Exceptions.ValidationException("Thứ hạng phải lớn hơn 0");

        FinalRank = newRank;
    }
}
