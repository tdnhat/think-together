using ThinkTogether.Domain.Exceptions;

namespace ThinkTogether.Domain.Aggregates.ChallengeAggregate.Entities;

public sealed partial class ChallengeAttempt
{
    public void AddAnswer(ChallengeAnswer answer)
    {
        if (answer == null)
            throw new ValidationException("Câu trả lời không được null");

        _answers.Add(answer);
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateScore(int score, int correctAnswers, int? completionTimeMs = null)
    {
        if (score < 0)
            throw new ValidationException("Điểm không được âm");

        if (correctAnswers < 0 || correctAnswers > TotalQuestions)
            throw new ValidationException("Số câu trả lời đúng phải từ 0 đến tổng số câu hỏi");

        if (completionTimeMs.HasValue && completionTimeMs.Value < 0)
            throw new ValidationException("Thời gian hoàn thành không được âm");

        ScoreAchieved = score;
        CorrectAnswers = correctAnswers;
        CompletionTimeMs = completionTimeMs;
        UpdatedAt = DateTime.UtcNow;
    }
}
