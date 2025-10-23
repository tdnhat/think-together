using Domain.Aggregates.GameSessionAggregate.Enums;

namespace Domain.Aggregates.GameSessionAggregate.Specifications;

public static class GameSessionSpecifications
{
    public static Func<GameSession, bool> IsActive => session => !session.IsDeleted;

    public static Func<GameSession, bool> IsInLobby => session => session.Status == GameStatus.PHONG_CHO;

    public static Func<GameSession, bool> IsPlaying => session => session.Status == GameStatus.DANG_CHOI;

    public static Func<GameSession, bool> IsFinished => session => session.Status == GameStatus.KET_THUC;

    public static Func<GameSession, bool> HostedBy(Guid userId) => session => session.HostId == userId;

    public static Func<GameSession, bool> UsingQuizSet(Guid quizSetId) => session => session.QuizSetId == quizSetId;

    public static Func<GameSession, bool> CreatedAfter(DateTime date) => session => session.CreatedAt > date;

    public static Func<GameSession, bool> HasPlayers => session => session.Players.Count > 0;
}

