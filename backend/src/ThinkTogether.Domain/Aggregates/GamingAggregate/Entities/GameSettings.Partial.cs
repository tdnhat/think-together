namespace ThinkTogether.Domain.Aggregates.GamingAggregate.Entities;

public sealed partial class GameSettings
{
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
