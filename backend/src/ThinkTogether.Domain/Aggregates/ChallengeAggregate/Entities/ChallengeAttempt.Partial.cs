using ThinkTogether.Domain.Exceptions;
using ThinkTogether.Domain.Enums;

using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Events;

namespace ThinkTogether.Domain.Aggregates.ChallengeAggregate.Entities;

public sealed partial class ChallengeAttempt
{
    public void AddAnswer(ChallengeAnswer answer)
    {
        if (answer == null)
            throw new ValidationException("Câu trả lời không được null");

        if (Status != AttemptStatus.InProgress)
            throw new ValidationException("Chỉ có thể thêm/cập nhật câu trả lời khi đang làm bài");

        _answers.Add(answer);
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateAnswer(ChallengeAnswer answer)
    {
        if (answer == null)
            throw new ValidationException("Câu trả lời không được null");

        if (Status != AttemptStatus.InProgress)
            throw new ValidationException("Chỉ có thể thêm/cập nhật câu trả lời khi đang làm bài");

        var existingAnswer = _answers.FirstOrDefault(a => a.QuestionId == answer.QuestionId);
        if (existingAnswer == null)
        {
            _answers.Add(answer);
        }
        else
        {
            _answers.Remove(existingAnswer);
            _answers.Add(answer);
        }
        UpdatedAt = DateTime.UtcNow;
    }

    public void NavigateToQuestion(int questionIndex)
    {
        if (Status != AttemptStatus.InProgress)
            throw new ValidationException("Chỉ có thể điều hướng khi đang trong quá trình làm bài");

        if (questionIndex < 0 || questionIndex >= TotalQuestions)
            throw new ValidationException("Chỉ số câu hỏi không hợp lệ");

        CurrentQuestionIndex = questionIndex;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Complete(int score, int correctAnswers, int completionTimeMs)
    {
        if (Status != AttemptStatus.InProgress)
            throw new ValidationException("Chỉ có thể hoàn thành khi đang làm bài");

        if (score < 0)
            throw new ValidationException("Điểm không được âm");

        if (correctAnswers < 0 || correctAnswers > TotalQuestions)
            throw new ValidationException("Số câu trả lời đúng phải từ 0 đến tổng số câu hỏi");

        if (completionTimeMs < 0)
            throw new ValidationException("Thời gian hoàn thành không được âm");

        Status = AttemptStatus.Completed;
        ScoreAchieved = score;
        CorrectAnswers = correctAnswers;
        CompletionTimeMs = completionTimeMs;
        CompletedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;

        AddDomainEvent(new ChallengeAttemptCompletedDomainEvent(
            Id,
            ChallengeId,
            UserId,
            ScoreAchieved,
            CorrectAnswers,
            CompletionTimeMs.Value,
            HomeworkId));
    }

    public void Abandon()
    {
        if (Status != AttemptStatus.InProgress)
            throw new ValidationException("Chỉ có thể bỏ dở khi đang trong quá trình làm bài");

        Status = AttemptStatus.Abandoned;
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

    public bool IsTimeExpired()
    {
        if (!TimeLimitMs.HasValue)
            return false;

        var elapsed = (DateTime.UtcNow - StartedAt).TotalMilliseconds;
        return elapsed >= TimeLimitMs.Value;
    }

    public int? GetRemainingTimeMs()
    {
        if (!TimeLimitMs.HasValue)
            return null;

        var elapsed = (int)(DateTime.UtcNow - StartedAt).TotalMilliseconds;
        var remaining = TimeLimitMs.Value - elapsed;
        return remaining > 0 ? remaining : 0;
    }

    public void FlagQuestion(Guid questionId)
    {
        if (Status != AttemptStatus.InProgress)
            throw new ValidationException("Chỉ có thể đánh dấu câu hỏi khi đang trong quá trình làm bài");

        if (_flaggedQuestions.Any(fq => fq.QuestionId == questionId))
            return; // Already flagged

        var flaggedQuestion = FlaggedQuestion.Create(Id, questionId);
        _flaggedQuestions.Add(flaggedQuestion);
        UpdatedAt = DateTime.UtcNow;
    }

    public void UnflagQuestion(Guid questionId)
    {
        if (Status != AttemptStatus.InProgress)
            throw new ValidationException("Chỉ có thể bỏ đánh dấu câu hỏi khi đang trong quá trình làm bài");

        var flaggedQuestion = _flaggedQuestions.FirstOrDefault(fq => fq.QuestionId == questionId);
        if (flaggedQuestion != null)
        {
            _flaggedQuestions.Remove(flaggedQuestion);
            UpdatedAt = DateTime.UtcNow;
        }
    }

    public bool IsQuestionFlagged(Guid questionId)
    {
        return _flaggedQuestions.Any(fq => fq.QuestionId == questionId);
    }
}
