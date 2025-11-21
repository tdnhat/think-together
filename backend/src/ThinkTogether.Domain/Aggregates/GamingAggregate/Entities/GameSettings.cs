using Shared.Primitives;

namespace Domain.Aggregates.GamingAggregate.Entities;

public sealed class GameSettings : Entity
{
    private GameSettings()
    {
    }

    public Guid Id { get; private set; }

    public Guid GameSessionId { get; private set; }

    public bool ShuffleQuestions { get; private set; }

    public bool ShuffleAnswers { get; private set; }

    public bool ShowLeaderboard { get; private set; }

    public bool ShowCorrectAnswers { get; private set; }

    public static GameSettings Create(Guid gameSessionId)
    {
        if (gameSessionId == Guid.Empty)
            throw new ArgumentException("Game session ID cannot be empty", nameof(gameSessionId));

        return new GameSettings
        {
            Id = Guid.NewGuid(),
            GameSessionId = gameSessionId,
            ShuffleQuestions = false,
            ShuffleAnswers = false,
            ShowLeaderboard = true,
            ShowCorrectAnswers = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    public void UpdateSettings(
        bool shuffleQuestions,
        bool shuffleAnswers,
        bool showLeaderboard,
        bool showCorrectAnswers)
    {
        ShuffleQuestions = shuffleQuestions;
        ShuffleAnswers = shuffleAnswers;
        ShowLeaderboard = showLeaderboard;
        ShowCorrectAnswers = showCorrectAnswers;
        UpdatedAt = DateTime.UtcNow;
    }
}

