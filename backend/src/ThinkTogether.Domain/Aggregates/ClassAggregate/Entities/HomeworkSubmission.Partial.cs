using ThinkTogether.Domain.Exceptions;

namespace ThinkTogether.Domain.Aggregates.ClassAggregate.Entities;

public sealed partial class HomeworkSubmission
{
    public void UpdateScore(int score)
    {
        if (score < 0)
            throw new ValidationException("Điểm không được âm");

        Score = score;
        UpdatedAt = DateTime.UtcNow;
    }
}
