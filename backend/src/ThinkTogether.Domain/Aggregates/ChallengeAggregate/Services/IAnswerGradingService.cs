using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Entities;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Entities;

namespace ThinkTogether.Domain.Aggregates.ChallengeAggregate.Services;

/// <summary>
/// Service for grading answers to quiz questions.
/// Handles grading logic for all question types.
/// </summary>
public interface IAnswerGradingService
{
    /// <summary>
    /// Grades an answer for a question.
    /// </summary>
    /// <param name="question">The question being answered</param>
    /// <param name="selectedOptionIndexes">Selected option indexes (for SingleChoice, MultipleChoice, TrueFalse)</param>
    /// <param name="matchingPairs">Matching pairs (for Matching questions)</param>
    /// <param name="orderingItems">Ordering items (for Ordering questions)</param>
    /// <returns>Tuple containing whether the answer is correct and points earned</returns>
    (bool IsCorrect, int PointsEarned) GradeAnswer(
        Question question,
        List<int>? selectedOptionIndexes,
        List<AnswerMatchingPair>? matchingPairs,
        List<AnswerOrderingItem>? orderingItems);
}

