using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Entities;

namespace ThinkTogether.Domain.Aggregates.GamingAggregate.Services;

/// <summary>
/// Service for grading answers in game sessions.
/// Determines if an answer is correct based on the question type and submitted answer.
/// </summary>
public interface IGameAnswerGradingService
{
    /// <summary>
    /// Determines if an answer is correct for a question.
    /// </summary>
    /// <param name="question">The question being answered</param>
    /// <param name="selectedOptionIndexes">Selected option indexes (for SingleChoice, MultipleChoice, TrueFalse)</param>
    /// <returns>True if the answer is correct, false otherwise</returns>
    bool IsAnswerCorrect(Question question, List<int>? selectedOptionIndexes);
}

