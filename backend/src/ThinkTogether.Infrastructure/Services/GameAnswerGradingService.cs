using ThinkTogether.Domain.Aggregates.GamingAggregate.Services;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Entities;
using ThinkTogether.Domain.Enums;

namespace ThinkTogether.Infrastructure.Services;

public class GameAnswerGradingService : IGameAnswerGradingService
{
    public bool IsAnswerCorrect(Question question, List<int>? selectedOptionIndexes)
    {
        // Currently GameSession only supports multiple choice questions
        // This can be extended to support other question types in the future
        if (selectedOptionIndexes == null || !selectedOptionIndexes.Any())
        {
            return false;
        }

        var correctIndexes = question.Options
            .Select((o, index) => new { Option = o, Index = index })
            .Where(x => x.Option.IsCorrect)
            .Select(x => x.Index)
            .ToList();

        return selectedOptionIndexes.Count == correctIndexes.Count &&
               selectedOptionIndexes.All(i => correctIndexes.Contains(i));
    }
}

