namespace ThinkTogether.Api.Hubs;

public interface IGameHubClient
{
    Task PlayerJoined(PlayerJoinedMessage message);
    Task PlayerLeft(PlayerLeftMessage message);
    Task LobbyUpdated(LobbyUpdatedMessage message);
    Task GameStarted(GameStartedMessage message);
    Task QuestionStarted(QuestionStartedMessage message);
    Task QuestionEnded(QuestionEndedMessage message);
    Task GameEnded(GameEndedMessage message);
    Task AnswerReceived(AnswerReceivedMessage message);
    Task LeaderboardUpdated(LeaderboardUpdatedMessage message);
    Task Error(ErrorMessage message);
}

public record PlayerJoinedMessage(
    Guid PlayerId,
    string Nickname,
    int TotalPlayers);

public record PlayerLeftMessage(
    Guid PlayerId,
    string Nickname,
    int TotalPlayers);

public record LobbyUpdatedMessage(
    List<LobbyPlayerInfo> Players);

public record LobbyPlayerInfo(
    Guid Id,
    string Nickname);

public record GameStartedMessage(
    Guid GameSessionId,
    int TotalQuestions,
    int TotalPlayers);

public record QuestionStartedMessage(
    Guid GameQuestionId,
    Guid QuestionId,
    string Content,
    string QuestionType,
    int TimeLimit,
    int PositionInGame,
    int TotalQuestions,
    string? VideoUrl,
    int? VideoTimestamp,
    List<QuestionOptionInfo> Options);

public record QuestionOptionInfo(
    int Index,
    string Content,
    string? ImageUrl);

public record QuestionEndedMessage(
    Guid GameQuestionId,
    List<int> CorrectOptionIndexes,
    int CorrectAnswerCount,
    int WrongAnswerCount,
    List<LeaderboardEntry> TopPlayers);

public record AnswerReceivedMessage(
    Guid PlayerId,
    int AnsweredCount,
    int TotalPlayers);

public record LeaderboardEntry(
    Guid PlayerId,
    string Nickname,
    int TotalPoints,
    int CorrectAnswers,
    int Rank);

public record LeaderboardUpdatedMessage(
    List<LeaderboardEntry> Leaderboard);

public record GameEndedMessage(
    Guid GameSessionId,
    int TotalQuestions,
    int TotalPlayers,
    TimeSpan Duration,
    List<LeaderboardEntry> FinalLeaderboard);

public record ErrorMessage(
    string Code,
    string Message);

