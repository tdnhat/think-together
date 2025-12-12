using ThinkTogether.Domain.Exceptions;

namespace ThinkTogether.Domain.Aggregates.GamingAggregate.Entities;

public sealed partial class GameScore
{
    public void AddPoints(int points)
    {
        if (points < 0)
            throw new ValidationException("Điểm không được âm");

        TotalPoints += points;
        UpdatedAt = DateTime.UtcNow;
    }

    public void RecordCorrectAnswer()
    {
        if (CorrectAnswers >= TotalQuestions)
            throw new ConflictException("Không thể vượt quá tổng số câu hỏi");

        CorrectAnswers++;
        CalculateAccuracy();
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetFinalRank(int rank)
    {
        if (rank <= 0)
            throw new ValidationException("Xếp hạng phải dương");

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
