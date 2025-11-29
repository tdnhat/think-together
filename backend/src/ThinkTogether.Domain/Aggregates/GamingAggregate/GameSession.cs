using Domain.Aggregates.GamingAggregate.Entities;
using Domain.Exceptions;
using Shared.Primitives;

namespace Domain.Aggregates.GamingAggregate;

public enum GameStatus
{
    Waiting,
    Started,
    Ended
}

public sealed partial class GameSession : AggregateRoot
{
    private readonly List<GamePlayer> _players = new();
    private readonly List<GameQuestion> _gameQuestions = new();
    private readonly List<GameScore> _scores = new();

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

        return new GameSession
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
    }
}

