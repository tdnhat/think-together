using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Entities;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Entities;

namespace ThinkTogether.Domain.Aggregates.ChallengeAggregate.Services;

public interface IAnswerGradingService
{
    (bool IsCorrect, int PointsEarned) GradeAnswer(
        Question question,
        List<int>? selectedOptionIndexes,
        List<AnswerMatchingPair>? matchingPairs,
        List<AnswerOrderingItem>? orderingItems);
}

