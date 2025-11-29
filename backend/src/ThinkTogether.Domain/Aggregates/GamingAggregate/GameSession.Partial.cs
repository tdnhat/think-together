using Domain.Aggregates.GamingAggregate.Entities;
using Domain.Exceptions;
using Shared.Primitives;

namespace Domain.Aggregates.GamingAggregate;

public sealed partial class GameSession : AggregateRoot
{
    public void AddPlayer(GamePlayer player)
    {
        if (player == null)
            throw new ValidationException("Người chơi không được null");

        if (Status != GameStatus.Waiting)
            throw new ConflictException("Không thể thêm người chơi sau khi trò chơi đã bắt đầu");

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
            throw new ValidationException("Câu hỏi trò chơi không được null");

        _gameQuestions.Add(gameQuestion);
        UpdatedAt = DateTime.UtcNow;
    }

    public void AddScore(GameScore score)
    {
        if (score == null)
            throw new ValidationException("Điểm số không được null");

        _scores.Add(score);
        UpdatedAt = DateTime.UtcNow;
    }

    public void Start()
    {
        if (Status != GameStatus.Waiting)
            throw new ConflictException("Chỉ có thể bắt đầu trò chơi ở trạng thái Chờ");

        if (_players.Count == 0)
            throw new ValidationException("Không thể bắt đầu trò chơi mà không có người chơi");

        Status = GameStatus.Started;
        StartedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void End()
    {
        if (Status != GameStatus.Started)
            throw new ConflictException("Chỉ có thể kết thúc trò chơi đã bắt đầu");

        Status = GameStatus.Ended;
        EndedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void MoveToNextQuestion()
    {
        if (Status != GameStatus.Started)
            throw new ConflictException("Trò chơi phải được bắt đầu để chuyển sang câu hỏi tiếp theo");

        CurrentQuestionIndex++;
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetCurrentQuestionIndex(int index)
    {
        if (index < 0)
            throw new ValidationException("Chỉ số câu hỏi không được âm");

        CurrentQuestionIndex = index;
        UpdatedAt = DateTime.UtcNow;
    }
}
