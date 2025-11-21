using Shared.Primitives;

namespace Domain.Aggregates.ChallengeAggregate.Entities;

public sealed class ChallengeAttempt : Entity
{
    private readonly List<ChallengeAnswer> _answers = new();

    private ChallengeAttempt()
    {
    }

    public Guid Id { get; private set; }

    public Guid ChallengeId { get; private set; }

    public Guid? UserId { get; private set; }

    public string Nickname { get; private set; } = string.Empty;

    public int ScoreAchieved { get; private set; }

    public int CorrectAnswers { get; private set; }

    public int TotalQuestions { get; private set; }

    public int? CompletionTimeMs { get; private set; }

    public DateTime CompletedAt { get; private set; }

    public IReadOnlyList<ChallengeAnswer> Answers => _answers.AsReadOnly();

    public static ChallengeAttempt Create(
        Guid challengeId,
        Guid? userId,
        string nickname,
        int totalQuestions)
    {
        if (challengeId == Guid.Empty)
            throw new ArgumentException("Challenge ID cannot be empty", nameof(challengeId));

        if (string.IsNullOrWhiteSpace(nickname))
            throw new ArgumentException("Nickname cannot be empty", nameof(nickname));

        if (nickname.Length > 100)
            throw new ArgumentException("Nickname cannot exceed 100 characters", nameof(nickname));

        if (totalQuestions < 0)
            throw new ArgumentException("Total questions cannot be negative", nameof(totalQuestions));

        return new ChallengeAttempt
        {
            Id = Guid.NewGuid(),
            ChallengeId = challengeId,
            UserId = userId,
            Nickname = nickname.Trim(),
            ScoreAchieved = 0,
            CorrectAnswers = 0,
            TotalQuestions = totalQuestions,
            CompletionTimeMs = null,
            CompletedAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    public void AddAnswer(ChallengeAnswer answer)
    {
        if (answer == null)
            throw new ArgumentNullException(nameof(answer));

        _answers.Add(answer);
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateScore(int score, int correctAnswers, int? completionTimeMs = null)
    {
        if (score < 0)
            throw new ArgumentException("Score cannot be negative", nameof(score));

        if (correctAnswers < 0 || correctAnswers > TotalQuestions)
            throw new ArgumentException("Correct answers must be between 0 and total questions", nameof(correctAnswers));

        if (completionTimeMs.HasValue && completionTimeMs.Value < 0)
            throw new ArgumentException("Completion time cannot be negative", nameof(completionTimeMs));

        ScoreAchieved = score;
        CorrectAnswers = correctAnswers;
        CompletionTimeMs = completionTimeMs;
        UpdatedAt = DateTime.UtcNow;
    }
}

