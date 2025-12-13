using ThinkTogether.Domain.Exceptions;
using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.ChallengeAggregate.Entities;

public sealed class FlaggedQuestion : Entity
{
    private FlaggedQuestion()
    {
    }

    public Guid Id { get; private set; }

    public Guid ChallengeAttemptId { get; private set; }

    public Guid QuestionId { get; private set; }

    public static FlaggedQuestion Create(
        Guid challengeAttemptId,
        Guid questionId)
    {
        if (challengeAttemptId == Guid.Empty)
            throw new ValidationException("ID nỗ lực thử thách không được trống");

        if (questionId == Guid.Empty)
            throw new ValidationException("ID câu hỏi không được trống");

        return new FlaggedQuestion
        {
            Id = Guid.NewGuid(),
            ChallengeAttemptId = challengeAttemptId,
            QuestionId = questionId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }
}
