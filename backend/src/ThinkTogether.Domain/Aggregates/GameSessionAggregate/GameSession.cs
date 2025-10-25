using Domain.Aggregates.GameSessionAggregate.Entities;
using Domain.Aggregates.GameSessionAggregate.Enums;
using Domain.Aggregates.GameSessionAggregate.ValueObjects;
using Domain.Exceptions;

using Shared.Primitives;

namespace Domain.Aggregates.GameSessionAggregate;

public sealed class GameSession : AggregateRoot
{
    private readonly List<GamePlayer> _players = new();
    private readonly List<PlayerAnswer> _answers = new();

    // Private constructor for EF Core
    private GameSession()
    {
        PIN = null!;
    }

    public Guid Id { get; private set; }

    public Guid HostId { get; private set; }

    public Guid QuizSetId { get; private set; }

    public GamePin PIN { get; private set; }

    public GameStatus Status { get; private set; }

    public int CurrentQuestionIndex { get; private set; }

    public DateTime? StartedAt { get; private set; }

    public DateTime? EndedAt { get; private set; }

    public GameSettings? Settings { get; private set; }

    public IReadOnlyList<GamePlayer> Players => _players.AsReadOnly();

    public IReadOnlyList<PlayerAnswer> Answers => _answers.AsReadOnly();

    public static GameSession Create(
        Guid hostId,
        Guid quizSetId,
        GamePin pin,
        GameSettings? settings = null)
    {
        var gameSession = new GameSession
        {
            Id = Guid.NewGuid(),
            HostId = hostId,
            QuizSetId = quizSetId,
            PIN = pin,
            Status = GameStatus.PHONG_CHO,
            CurrentQuestionIndex = 0,
            Settings = settings,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        return gameSession;
    }

    public void AddPlayer(GamePlayer player)
    {
        if (Status != GameStatus.PHONG_CHO)
            throw new ValidationException("Chỉ có thể tham gia trong phòng chờ");

        if (_players.Count >= 200)
            throw new ValidationException("Vượt quá số lượng người tham gia tối đa");

        if (_players.Any(p => p.Nickname.Value.Equals(player.Nickname.Value, StringComparison.OrdinalIgnoreCase)))
            throw new ConflictException($"Tên người tham gia '{player.Nickname.Value}' đã được sử dụng");

        _players.Add(player);
    }

    public void RemovePlayer(Guid playerId)
    {
        var player = _players.FirstOrDefault(p => p.Id == playerId);
        if (player == null)
            throw new EntityNotFoundException(nameof(GamePlayer), playerId);

        _players.Remove(player);
    }

    public void Start()
    {
        if (Status != GameStatus.PHONG_CHO)
            throw new ValidationException("Chỉ có thể bắt đầu từ phòng chờ");

        if (_players.Count == 0)
            throw new ValidationException("Không thể bắt đầu mà không có người tham gia");

        Status = GameStatus.DANG_CHOI;
        StartedAt = DateTime.UtcNow;
        CurrentQuestionIndex = 0;
    }

    public void NextQuestion()
    {
        if (Status != GameStatus.DANG_CHOI)
            throw new ValidationException("Phải đang trong trạng thái chơi");

        CurrentQuestionIndex++;
    }

    public void RecordAnswer(PlayerAnswer answer)
    {
        if (Status != GameStatus.DANG_CHOI)
            throw new ValidationException("Chỉ có thể trả lời trong khi đang chơi");

        if (!_players.Any(p => p.Id == answer.GamePlayerId))
            throw new EntityNotFoundException(nameof(GamePlayer), answer.GamePlayerId);

        _answers.Add(answer);

        // Update player's score
        var player = _players.First(p => p.Id == answer.GamePlayerId);
        player.AddPoints(answer.PointsEarned);
    }

    public void Finish()
    {
        if (Status == GameStatus.KET_THUC)
            return; // Already finished

        Status = GameStatus.KET_THUC;
        EndedAt = DateTime.UtcNow;
        // Calculate final rankings
        UpdateRankings();
    }

    public void UpdateRankings()
    {
        var rankedPlayers = _players
            .OrderByDescending(p => p.Score.Value)
            .ToList();

        for (int i = 0; i < rankedPlayers.Count; i++)
        {
            rankedPlayers[i].UpdateRank(i + 1);
        }
    }

    public GamePlayer? GetPlayer(Guid playerId)
    {
        return _players.FirstOrDefault(p => p.Id == playerId);
    }

    public GamePlayer? GetPlayerByNickname(string nickname)
    {
        return _players.FirstOrDefault(p =>
            p.Nickname.Value.Equals(nickname, StringComparison.OrdinalIgnoreCase));
    }

    public bool IsNicknameAvailable(string nickname)
    {
        return !_players.Any(p =>
            p.Nickname.Value.Equals(nickname, StringComparison.OrdinalIgnoreCase));
    }

    public int GetActivePlayerCount()
    {
        return _players.Count(p => p.IsConnected());
    }

    public bool IsInLobby() => Status == GameStatus.PHONG_CHO;

    public bool IsActive() => Status == GameStatus.DANG_CHOI;

    public bool IsFinished() => Status == GameStatus.KET_THUC;
}

