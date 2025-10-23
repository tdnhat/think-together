using Shared.Primitives;

namespace Domain.Aggregates.GameSessionAggregate.Entities;

public sealed class GameSettings : Entity
{
    // Private constructor for EF Core
    private GameSettings()
    {
    }
    public Guid Id { get; private set; }

    public Guid GameSessionId { get; private set; }
    public bool ShuffleQuestions { get; private set; }
    public bool ShuffleAnswers { get; private set; }
    public bool ShowLeaderboard { get; private set; }
    public bool ShowCorrectAnswers { get; private set; }

    public static GameSettings Create(
        Guid gameSessionId,
        bool shuffleQuestions = false,
        bool shuffleAnswers = false,
        bool showLeaderboard = true,
        bool showCorrectAnswers = true)
    {
        return new GameSettings
        {
            GameSessionId = gameSessionId,
            ShuffleQuestions = shuffleQuestions,
            ShuffleAnswers = shuffleAnswers,
            ShowLeaderboard = showLeaderboard,
            ShowCorrectAnswers = showCorrectAnswers,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    public void Update(
        bool? shuffleQuestions = null,
        bool? shuffleAnswers = null,
        bool? showLeaderboard = null,
        bool? showCorrectAnswers = null)
    {
        if (shuffleQuestions.HasValue)
            ShuffleQuestions = shuffleQuestions.Value;

        if (shuffleAnswers.HasValue)
            ShuffleAnswers = shuffleAnswers.Value;

        if (showLeaderboard.HasValue)
            ShowLeaderboard = showLeaderboard.Value;

        if (showCorrectAnswers.HasValue)
            ShowCorrectAnswers = showCorrectAnswers.Value;
    }
}

