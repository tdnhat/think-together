using Domain.Aggregates.GamingAggregate.Entities;
using Shared.Primitives;

namespace Domain.Aggregates.GamingAggregate;

public enum GameStatus
{
    Waiting,
    Started,
    Ended
}

public sealed class GameSession : AggregateRoot
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
            throw new ArgumentException("Host user ID cannot be empty", nameof(hostUserId));

        if (quizSetId == Guid.Empty)
            throw new ArgumentException("Quiz set ID cannot be empty", nameof(quizSetId));

        if (string.IsNullOrWhiteSpace(pin) || pin.Length != 6)
            throw new ArgumentException("PIN must be 6 digits", nameof(pin));

        if (!pin.All(char.IsDigit))
            throw new ArgumentException("PIN must contain only digits", nameof(pin));

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

    public void AddPlayer(GamePlayer player)
    {
        if (player == null)
            throw new ArgumentNullException(nameof(player));

        if (Status != GameStatus.Waiting)
            throw new InvalidOperationException("Cannot add players after game has started");

        _players.Add(player);
        UpdatedAt = DateTime.UtcNow;
    }

    public void RemovePlayer(Guid playerId)
    {
        var player = _players.FirstOrDefault(p => p.Id == playerId);
        if (player != null)
        {
            _players.Remove(player);
            UpdatedAt = DateTime.UtcNow;
        }
    }

    public void AddGameQuestion(GameQuestion gameQuestion)
    {
        if (gameQuestion == null)
            throw new ArgumentNullException(nameof(gameQuestion));

        _gameQuestions.Add(gameQuestion);
        UpdatedAt = DateTime.UtcNow;
    }

    public void AddScore(GameScore score)
    {
        if (score == null)
            throw new ArgumentNullException(nameof(score));

        _scores.Add(score);
        UpdatedAt = DateTime.UtcNow;
    }

    public void Start()
    {
        if (Status != GameStatus.Waiting)
            throw new InvalidOperationException("Can only start a game in Waiting status");

        if (_players.Count == 0)
            throw new InvalidOperationException("Cannot start game without players");

        Status = GameStatus.Started;
        StartedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void End()
    {
        if (Status != GameStatus.Started)
            throw new InvalidOperationException("Can only end a game that has started");

        Status = GameStatus.Ended;
        EndedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void MoveToNextQuestion()
    {
        if (Status != GameStatus.Started)
            throw new InvalidOperationException("Game must be started to move to next question");

        CurrentQuestionIndex++;
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetCurrentQuestionIndex(int index)
    {
        if (index < 0)
            throw new ArgumentException("Question index cannot be negative", nameof(index));

        CurrentQuestionIndex = index;
        UpdatedAt = DateTime.UtcNow;
    }
}

