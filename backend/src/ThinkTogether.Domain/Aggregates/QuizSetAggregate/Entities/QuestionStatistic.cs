using Domain.Exceptions;
using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.QuizSetAggregate.Entities;

public sealed partial class QuestionStatistic : Entity
{
    private QuestionStatistic()
    {
    }

    public Guid Id { get; private set; }

    public Guid QuestionId { get; private set; }

    public int TimesAsked { get; private set; }

    public int CorrectAnswers { get; private set; }

    public int WrongAnswers { get; private set; }

    public int AverageResponseTimeMs { get; private set; }

    public decimal Difficulty { get; private set; }

    public static QuestionStatistic Create(Guid questionId)
    {
        if (questionId == Guid.Empty)
            throw new ValidationException("ID câu hỏi không được trống");

        return new QuestionStatistic
        {
            Id = Guid.NewGuid(),
            QuestionId = questionId,
            TimesAsked = 0,
            CorrectAnswers = 0,
            WrongAnswers = 0,
            AverageResponseTimeMs = 0,
            Difficulty = 0,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }
}

