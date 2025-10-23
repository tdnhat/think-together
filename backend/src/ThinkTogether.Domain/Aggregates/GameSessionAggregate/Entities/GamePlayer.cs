using Domain.Aggregates.GameSessionAggregate.Enums;
using Domain.Aggregates.GameSessionAggregate.ValueObjects;
using Domain.Exceptions;

using Shared.Primitives;

namespace Domain.Aggregates.GameSessionAggregate.Entities;

public sealed class GamePlayer : Entity
{
    // Private constructor for EF Core
    private GamePlayer()
    {
        Nickname = null!;
    }

    public Guid Id { get; private set; }

    public Guid GameSessionId { get; private set; }

    public PlayerNickname Nickname { get; private set; }

    public Score Score { get; private set; } = Score.Zero();

    public int Rank { get; private set; }

    public ConnectionStatus ConnectionStatus { get; private set; }

    public static GamePlayer Create(
        Guid gameSessionId,
        PlayerNickname nickname)
    {
        return new GamePlayer
        {
            GameSessionId = gameSessionId,
            Nickname = nickname,
            Score = Score.Zero(),
            Rank = 0,
            ConnectionStatus = ConnectionStatus.KET_NOI,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    public void AddPoints(int points)
    {
        if (points <= 0)
            throw new ValidationException("Điểm số phải là số dương");

        Score = Score.Add(points);
    }

    public void UpdateRank(int rank)
    {
        if (rank < 1)
            throw new ValidationException("Thứ hạng phải lớn hơn 0");

        Rank = rank;
    }

    public void Connect()
    {
        if (ConnectionStatus == ConnectionStatus.KET_NOI)
            return; // Already connected

        ConnectionStatus = ConnectionStatus.KET_NOI;
    }

    public void Disconnect()
    {
        if (ConnectionStatus == ConnectionStatus.NGAT_KET_NOI)
            return; // Already disconnected

        ConnectionStatus = ConnectionStatus.NGAT_KET_NOI;
    }

    public bool IsConnected() => ConnectionStatus == ConnectionStatus.KET_NOI;
}