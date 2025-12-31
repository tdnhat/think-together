using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.QuizSetAggregate.Specifications;

public sealed class QuizSetsByCreatorIdSpecification : Specification<QuizSet>
{
    public QuizSetsByCreatorIdSpecification(
        Guid creatorId,
        string? search = null,
        string? filterBy = null,
        string? sortBy = null,
        int page = 1,
        int pageSize = 10)
    {
        var searchLower = search?.ToLower();

        // Build criteria with all conditions combined
        Criteria = quizSet => 
            QuizSetSpecifications.CreatedBy(creatorId).Compile()(quizSet)
            && QuizSetSpecifications.IsActive.Compile()(quizSet)
            && (string.IsNullOrWhiteSpace(search) || 
                QuizSetSpecifications.ContainsText(search).Compile()(quizSet))
            && (filterBy == null || filterBy == "all" ||
                (filterBy == "published" && QuizSetSpecifications.IsPublished.Compile()(quizSet)) ||
                (filterBy == "draft" && !QuizSetSpecifications.IsPublished.Compile()(quizSet)));

        // Sorting
        switch (sortBy?.ToLower())
        {
            case "oldest":
                ApplyOrderBy(quizSet => quizSet.CreatedAt);
                break;
            case "title":
                ApplyOrderBy(quizSet => quizSet.Title);
                break;
            case "questions":
                ApplyOrderByDescending(quizSet => quizSet.Questions.Count);
                break;
            default: // newest (default)
                ApplyOrderByDescending(quizSet => quizSet.UpdatedAt);
                break;
        }

        // Pagination
        var skip = (page - 1) * pageSize;
        ApplyPaging(skip, pageSize);
    }
}

