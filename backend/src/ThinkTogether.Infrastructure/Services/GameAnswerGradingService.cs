using ThinkTogether.Domain.Aggregates.GamingAggregate.Services;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Entities;
using ThinkTogether.Domain.Enums;

namespace ThinkTogether.Infrastructure.Services;

public class GameAnswerGradingService : IGameAnswerGradingService
{
    public bool IsAnswerCorrect(Question question, List<int>? selectedOptionIndexes)
    {
        if (selectedOptionIndexes == null || !selectedOptionIndexes.Any())
        {
            return false;
        }

        switch (question.Type)
        {
            case QuestionType.SingleChoice:
            case QuestionType.MultipleChoice:
            case QuestionType.TrueFalse:
            case QuestionType.Video:
            case QuestionType.Audio:
                var correctIndexes = question.Options
                    .Select((o, index) => new { Option = o, Index = index })
                    .Where(x => x.Option.IsCorrect)
                    .Select(x => x.Index)
                    .ToList();

                return selectedOptionIndexes.Count == correctIndexes.Count &&
                       selectedOptionIndexes.All(i => correctIndexes.Contains(i));

            case QuestionType.Matching:
                // For Matching, selectedOptionIndexes represents the Right item ID for each Left item (in order)
                // Since we map IDs to Pair Index, for each Left item at index i (which is Pair i),
                // the correct Right item ID must be i.
                if (selectedOptionIndexes.Count != question.MatchingPairs.Count)
                    return false;

                for (int i = 0; i < selectedOptionIndexes.Count; i++)
                {
                    if (selectedOptionIndexes[i] != i)
                        return false;
                }
                return true;

            case QuestionType.Ordering:
                // For Ordering, selectedOptionIndexes represents the sequence of Item IDs in the user's order.
                // IDs are 0..N based on Storage Order.
                // Correct sequence matches the items sorted by CorrectPosition.
                if (selectedOptionIndexes.Count != question.OrderingItems.Count)
                    return false;

                var correctSequence = question.OrderingItems
                    .Select((item, index) => new { Item = item, Id = index })
                    .OrderBy(x => x.Item.CorrectPosition)
                    .Select(x => x.Id)
                    .ToList();

                return selectedOptionIndexes.SequenceEqual(correctSequence);

            default:
                return false;
        }
    }
}

