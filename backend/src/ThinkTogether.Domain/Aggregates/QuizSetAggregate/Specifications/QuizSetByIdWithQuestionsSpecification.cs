using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.QuizSetAggregate.Specifications;

public sealed class QuizSetByIdWithQuestionsSpecification : Specification<QuizSet>
{
    public QuizSetByIdWithQuestionsSpecification(Guid id)
    {
        Criteria = quizSet => quizSet.Id == id && quizSet.DeletedAt == null;
        AddInclude(quizSet => quizSet.Questions);
    }
}
