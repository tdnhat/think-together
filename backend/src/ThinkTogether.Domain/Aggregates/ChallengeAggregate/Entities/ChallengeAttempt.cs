using ThinkTogether.Domain.Exceptions;
using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.ChallengeAggregate.Entities;

public sealed partial class ChallengeAttempt : Entity
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
            throw new ValidationException("ID thử thách không được trống");

        if (string.IsNullOrWhiteSpace(nickname))
            throw new ValidationException("Biệt danh không được trống");

        if (nickname.Length > 100)
            throw new ValidationException("Biệt danh không được vượt quá 100 ký tự");

        if (totalQuestions < 0)
            throw new ValidationException("Tổng số câu hỏi không được âm");

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
}
