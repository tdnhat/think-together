using ThinkTogether.Domain.Aggregates.GamingAggregate.Entities;
using ThinkTogether.Domain.Exceptions;
using Shared.Primitives;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Events;
using ThinkTogether.Domain.Enums;

namespace ThinkTogether.Domain.Aggregates.GamingAggregate;

public sealed partial class GameSession : AggregateRoot
{
    public void ValidateHostPermission(Guid userId)
    {
        if (HostUserId != userId)
            throw new ForbiddenException("Chỉ người chủ phiên mới có quyền thực hiện thao tác này");
    }

    public void AddPlayer(GamePlayer player)
    {
        if (player == null)
            throw new ValidationException("Người chơi không được null");

        if (Status != GameStatus.Waiting)
            throw new ConflictException("Không thể thêm người chơi sau khi trò chơi đã bắt đầu");

        if (_players.Any(p => p.Nickname.Equals(player.Nickname, StringComparison.OrdinalIgnoreCase)))
            throw new ConflictException("Nickname đã được sử dụng trong phiên này");

        _players.Add(player);
        UpdatedAt = DateTime.UtcNow;

        AddDomainEvent(new PlayerJoinedGameDomainEvent(Id, player.Id, player.Nickname));
    }

    public void AddGameQuestion(GameQuestion gameQuestion)
    {
        if (gameQuestion == null)
            throw new ValidationException("Câu hỏi trò chơi không được null");

        _gameQuestions.Add(gameQuestion);
        UpdatedAt = DateTime.UtcNow;
    }

    public void AddGameQuestions(IEnumerable<GameQuestion> gameQuestions)
    {
        foreach (var question in gameQuestions)
        {
            AddGameQuestion(question);
        }
    }

    public void AddScore(GameScore score)
    {
        if (score == null)
            throw new ValidationException("Điểm số không được null");

        _scores.Add(score);
        UpdatedAt = DateTime.UtcNow;
    }

    public void InitializeScores(int totalQuestions)
    {
        foreach (var player in _players)
        {
            var score = GameScore.Create(Id, player.Id, totalQuestions);
            AddScore(score);
        }
    }

    public void AddPlayerAnswer(PlayerAnswer answer)
    {
        if (answer == null)
            throw new ValidationException("Câu trả lời không được null");

        _playerAnswers.Add(answer);
        UpdatedAt = DateTime.UtcNow;
    }

    public void Start()
    {
        if (Status != GameStatus.Waiting)
            throw new ConflictException("Chỉ có thể bắt đầu trò chơi ở trạng thái Chờ");

        if (_players.Count == 0)
            throw new ValidationException("Không thể bắt đầu trò chơi mà không có người chơi");

        if (_gameQuestions.Count == 0)
            throw new ValidationException("Không thể bắt đầu trò chơi mà không có câu hỏi");

        Status = GameStatus.InProgress;
        StartedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;

        AddDomainEvent(new GameStartedDomainEvent(Id, _gameQuestions.Count, _players.Count));
    }

    public void End()
    {
        if (Status != GameStatus.InProgress)
            throw new ConflictException("Chỉ có thể kết thúc trò chơi đã bắt đầu");

        Status = GameStatus.Ended;
        EndedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;

        CalculateFinalRanks();

        AddDomainEvent(new GameEndedDomainEvent(Id));
    }

    public void MoveToNextQuestion()
    {
        if (Status != GameStatus.InProgress)
            throw new ConflictException("Trò chơi phải được bắt đầu để chuyển sang câu hỏi tiếp theo");

        if (!HasMoreQuestions())
            throw new ConflictException("Không còn câu hỏi nào");

        CurrentQuestionIndex++;
        UpdatedAt = DateTime.UtcNow;
    }

    private void CalculateFinalRanks()
    {
        var rankedScores = _scores
            .OrderByDescending(s => s.TotalPoints)
            .ThenByDescending(s => s.CorrectAnswers)
            .ToList();

        for (int i = 0; i < rankedScores.Count; i++)
        {
            rankedScores[i].SetFinalRank(i + 1);
        }
    }
}
