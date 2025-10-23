using Domain.Exceptions;

using Shared.Primitives;

namespace Domain.Aggregates.GameSessionAggregate.Entities;

public sealed class PlayerAnswer : Entity
{
    // Private constructor for EF Core
    private PlayerAnswer()
    {
    }

    public Guid Id { get; private set; }

    public Guid GamePlayerId { get; private set; }

    public Guid QuestionId { get; private set; }

    public string? Answer { get; private set; }

    public bool IsCorrect { get; private set; }

    public int PointsEarned { get; private set; }

    public int TimeToAnswer { get; private set; }

    public static PlayerAnswer Create(
        Guid gamePlayerId,
        Guid questionId,
        string? answer,
        bool isCorrect,
        int pointsEarned,
        int timeToAnswer)
    {
        ValidateTimeToAnswer(timeToAnswer);
        ValidatePointsEarned(pointsEarned);

        return new PlayerAnswer
        {
            GamePlayerId = gamePlayerId,
            QuestionId = questionId,
            Answer = answer?.Trim(),
            IsCorrect = isCorrect,
            PointsEarned = pointsEarned,
            TimeToAnswer = timeToAnswer,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    private static void ValidateTimeToAnswer(int timeToAnswer)
    {
        if (timeToAnswer < 0)
            throw new ValidationException("Thời gian trả lời không được âm");
    }

    private static void ValidatePointsEarned(int pointsEarned)
    {
        if (pointsEarned < 0)
            throw new ValidationException("Điểm số đạt được không được âm");
    }
}

