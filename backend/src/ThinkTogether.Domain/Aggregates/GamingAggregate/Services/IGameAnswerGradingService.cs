using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Entities;

namespace ThinkTogether.Domain.Aggregates.GamingAggregate.Services;

public interface IGameAnswerGradingService
{
    bool IsAnswerCorrect(Question question, List<int>? selectedOptionIndexes);
}

