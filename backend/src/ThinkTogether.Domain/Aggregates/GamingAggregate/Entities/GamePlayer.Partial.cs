using ThinkTogether.Domain.Exceptions;
using ThinkTogether.Domain.Enums;

namespace ThinkTogether.Domain.Aggregates.GamingAggregate.Entities;

public sealed partial class GamePlayer
{
    public void AddAnswer(PlayerAnswer answer)
    {
        if (answer == null)
            throw new ValidationException("Câu trả lời không được null");

        if (_answers.Any(a => a.GameQuestionId == answer.GameQuestionId))
            throw new ConflictException("Đã trả lời câu hỏi này rồi");

        _answers.Add(answer);
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetConnectionId(string? connectionId)
    {
        ConnectionId = connectionId;
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetConnectionStatus(ConnectionStatus status)
    {
        ConnectionStatus = status;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Connect(string? connectionId = null)
    {
        ConnectionStatus = ConnectionStatus.Connected;
        ConnectionId = connectionId;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Disconnect()
    {
        ConnectionStatus = ConnectionStatus.Disconnected;
        ConnectionId = null;
        UpdatedAt = DateTime.UtcNow;
    }
}
