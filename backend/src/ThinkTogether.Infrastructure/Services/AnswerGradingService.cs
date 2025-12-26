using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Entities;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Services;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Entities;
using ThinkTogether.Domain.Enums;

namespace ThinkTogether.Infrastructure.Services;

public class AnswerGradingService : IAnswerGradingService
{
    public (bool IsCorrect, int PointsEarned) GradeAnswer(
        Question question,
        List<int>? selectedOptionIndexes,
        List<AnswerMatchingPair>? matchingPairs,
        List<AnswerOrderingItem>? orderingItems)
    {
        var isCorrect = false;

        switch (question.Type)
        {
            case QuestionType.SingleChoice:
            case QuestionType.MultipleChoice:
            case QuestionType.TrueFalse:
                if (selectedOptionIndexes == null || !selectedOptionIndexes.Any())
                {
                    isCorrect = false;
                }
                else
                {
                    var correctIndexes = question.Options
                        .Select((o, index) => new { Option = o, Index = index })
                        .Where(x => x.Option.IsCorrect)
                        .Select(x => x.Index)
                        .ToList();

                    isCorrect = selectedOptionIndexes.Count == correctIndexes.Count &&
                               selectedOptionIndexes.All(i => correctIndexes.Contains(i));
                }
                break;

            case QuestionType.Matching:
                if (matchingPairs == null || !matchingPairs.Any())
                {
                    isCorrect = false;
                }
                else
                {
                    var correctPairs = question.MatchingPairs.OrderBy(p => p.DisplayOrder).ToList();
                    isCorrect = correctPairs.Count == matchingPairs.Count &&
                               correctPairs.All(cp =>
                                   matchingPairs.Any(sp =>
                                       sp.LeftContent == cp.LeftContent &&
                                       sp.RightContent == cp.RightContent));
                }
                break;

            case QuestionType.Ordering:
                if (orderingItems == null || !orderingItems.Any())
                {
                    isCorrect = false;
                }
                else
                {
                    var correctOrder = question.OrderingItems
                        .OrderBy(i => i.CorrectPosition)
                        .Select(i => i.Content)
                        .ToList();

                    var submittedOrder = orderingItems
                        .OrderBy(i => i.Position)
                        .Select(i => i.Content)
                        .ToList();

                    isCorrect = correctOrder.SequenceEqual(submittedOrder);
                }
                break;
        }

        var pointsEarned = isCorrect ? 10 : 0;
        return (isCorrect, pointsEarned);
    }
}

