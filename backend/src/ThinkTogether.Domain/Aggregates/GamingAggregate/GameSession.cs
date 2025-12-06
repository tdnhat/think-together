using ThinkTogether.Domain.Aggregates.GamingAggregate.Entities;
using ThinkTogether.Domain.Exceptions;
using Shared.Primitives;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Events;
using ThinkTogether.Domain.Enums;

namespace ThinkTogether.Domain.Aggregates.GamingAggregate;

public sealed partial class GameSession : AggregateRoot
{
    private readonly List<GamePlayer> _players = new();
    private readonly List<GameQuestion> _gameQuestions = new();
    private readonly List<GameScore> _scores = new();
    private readonly List<PlayerAnswer> _playerAnswers = new();

    private GameSession()
    {
    }

    public Guid Id { get; private set; }

    public Guid HostUserId { get; private set; }

    public Guid QuizSetId { get; private set; }

    public string PIN { get; private set; } = string.Empty;

    public GameStatus Status { get; private set; }

    public int CurrentQuestionIndex { get; private set; }

    public DateTime? StartedAt { get; private set; }

    public DateTime? EndedAt { get; private set; }

    public IReadOnlyList<GamePlayer> Players => _players.AsReadOnly();

    public IReadOnlyList<GameQuestion> GameQuestions => _gameQuestions.AsReadOnly();

    public IReadOnlyList<GameScore> Scores => _scores.AsReadOnly();

    public IReadOnlyList<PlayerAnswer> PlayerAnswers => _playerAnswers.AsReadOnly();

    public static GameSession Create(Guid hostUserId, Guid quizSetId, string pin)
    {
        if (hostUserId == Guid.Empty)
            throw new ValidationException("ID người dùng chủ không được trống");

        if (quizSetId == Guid.Empty)
            throw new ValidationException("ID bộ câu hỏi không được trống");

        if (string.IsNullOrWhiteSpace(pin) || pin.Length != 6)
            throw new ValidationException("Mã PIN phải có 6 chữ số");

        if (!pin.All(char.IsDigit))
            throw new ValidationException("Mã PIN chỉ được chứa chữ số");

        var session = new GameSession
        {
            Id = Guid.NewGuid(),
            HostUserId = hostUserId,
            QuizSetId = quizSetId,
            PIN = pin,
            Status = GameStatus.Waiting,
            CurrentQuestionIndex = 0,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        session.AddDomainEvent(new GameSessionCreatedDomainEvent(
            session.Id,
            hostUserId,
            quizSetId,
            pin));

        return session;
    }

    /// <summary>
    /// Finds a player by their ID.
    /// </summary>
    public GamePlayer? GetPlayer(Guid playerId)
    {
        return _players.FirstOrDefault(p => p.Id == playerId);
    }

    public GameQuestion? GetCurrentGameQuestion()
    {
        return _gameQuestions.FirstOrDefault(q => q.PositionInGame == CurrentQuestionIndex);
    }

    public bool HasMoreQuestions()
    {
        return CurrentQuestionIndex < _gameQuestions.Count - 1;
    }

    public GameScore? GetPlayerScore(Guid playerId)
    {
        return _scores.FirstOrDefault(s => s.GamePlayerId == playerId);
    }
}
