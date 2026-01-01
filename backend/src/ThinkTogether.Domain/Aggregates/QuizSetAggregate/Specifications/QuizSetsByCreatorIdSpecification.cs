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
            quizSet.CreatorId == creatorId
            && quizSet.DeletedAt == null
            && (string.IsNullOrWhiteSpace(search) || 
                (quizSet.Title.ToLower().Contains(searchLower!) 
                 || (quizSet.Description != null && quizSet.Description.ToLower().Contains(searchLower!))))
            && (filterBy == null || filterBy == "all" ||
                (filterBy == "published" && quizSet.IsPublished) ||
                (filterBy == "draft" && !quizSet.IsPublished));

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

        // Include Questions for QuestionCount mapping
        AddInclude(quizSet => quizSet.Questions);
    }
}
