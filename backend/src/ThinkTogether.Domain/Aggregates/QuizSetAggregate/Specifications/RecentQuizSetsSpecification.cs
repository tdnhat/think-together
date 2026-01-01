using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.QuizSetAggregate.Specifications;

public class RecentQuizSetsSpecification : Specification<QuizSet>
{
    public RecentQuizSetsSpecification(int count) 
    {
        Criteria = x => !x.DeletedAt.HasValue;
        ApplyOrderByDescending(x => x.CreatedAt);
        ApplyPaging(0, count);
    }
}
