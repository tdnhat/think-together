using ThinkTogether.Domain.Exceptions;
using Shared.Primitives;
using ThinkTogether.Domain.Enums;

namespace ThinkTogether.Domain.Aggregates.GamingAggregate.Entities;

public sealed partial class GamePlayer : Entity
{
    private readonly List<PlayerAnswer> _answers = new();

    private GamePlayer()
    {
    }

    public Guid Id { get; private set; }

    public Guid GameSessionId { get; private set; }

    public string Nickname { get; private set; } = string.Empty;

    public ConnectionStatus ConnectionStatus { get; private set; }

    public string? ConnectionId { get; private set; }

    public IReadOnlyList<PlayerAnswer> Answers => _answers.AsReadOnly();

    public static GamePlayer Create(Guid gameSessionId, string nickname)
    {
        if (gameSessionId == Guid.Empty)
            throw new ValidationException("ID phiên trò chơi không được trống");

        if (string.IsNullOrWhiteSpace(nickname))
            throw new ValidationException("Biệt danh không được trống");

        if (nickname.Length < 2 || nickname.Length > 100)
            throw new ValidationException("Biệt danh phải từ 2 đến 100 ký tự");

        return new GamePlayer
        {
            Id = Guid.NewGuid(),
            GameSessionId = gameSessionId,
            Nickname = nickname.Trim(),
            ConnectionStatus = ConnectionStatus.Connected,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    public bool HasAnswered(Guid gameQuestionId)
    {
        return _answers.Any(a => a.GameQuestionId == gameQuestionId);
    }
}
