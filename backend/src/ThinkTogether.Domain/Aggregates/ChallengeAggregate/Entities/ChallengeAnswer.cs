using ThinkTogether.Domain.Exceptions;
using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.ChallengeAggregate.Entities;

public sealed partial class ChallengeAnswer : Entity
{
    private readonly List<int> _selectedOptionIndexes = new();
    private readonly List<AnswerMatchingPair> _matchingPairs = new();
    private readonly List<AnswerOrderingItem> _orderingItems = new();

    private ChallengeAnswer()
    {
    }

    public Guid Id { get; private set; }

    public Guid ChallengeAttemptId { get; private set; }

    public Guid QuestionId { get; private set; }

    public int SubmissionTimeMs { get; private set; }

    public bool IsCorrect { get; private set; }

    public int PointsEarned { get; private set; }

    public IReadOnlyList<int> SelectedOptionIndexes => _selectedOptionIndexes.AsReadOnly();

    public IReadOnlyList<AnswerMatchingPair> MatchingPairs => _matchingPairs.AsReadOnly();

    public IReadOnlyList<AnswerOrderingItem> OrderingItems => _orderingItems.AsReadOnly();

    public static ChallengeAnswer Create(
        Guid challengeAttemptId,
        Guid questionId,
        int submissionTimeMs,
        bool isCorrect,
        int pointsEarned,
        List<int>? selectedOptionIndexes = null,
        List<AnswerMatchingPair>? matchingPairs = null,
        List<AnswerOrderingItem>? orderingItems = null)
    {
        if (challengeAttemptId == Guid.Empty)
            throw new ValidationException("ID nỗ lực thử thách không được trống");

        if (questionId == Guid.Empty)
            throw new ValidationException("ID câu hỏi không được trống");

        if (submissionTimeMs < 0)
            throw new ValidationException("Thời gian nộp không được âm");

        if (pointsEarned < 0)
            throw new ValidationException("Điểm kiếm được không được âm");

        var answer = new ChallengeAnswer
        {
            Id = Guid.NewGuid(),
            ChallengeAttemptId = challengeAttemptId,
            QuestionId = questionId,
            SubmissionTimeMs = submissionTimeMs,
            IsCorrect = isCorrect,
            PointsEarned = pointsEarned,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        if (selectedOptionIndexes != null)
        {
            answer._selectedOptionIndexes.AddRange(selectedOptionIndexes);
        }

        if (matchingPairs != null)
        {
            answer._matchingPairs.AddRange(matchingPairs);
        }

        if (orderingItems != null)
        {
            answer._orderingItems.AddRange(orderingItems);
        }

        return answer;
    }
}

public sealed class AnswerMatchingPair
{
    public string LeftContent { get; set; } = string.Empty;
    public string RightContent { get; set; } = string.Empty;
}

public sealed class AnswerOrderingItem
{
    public string Content { get; set; } = string.Empty;
    public int Position { get; set; }
}
