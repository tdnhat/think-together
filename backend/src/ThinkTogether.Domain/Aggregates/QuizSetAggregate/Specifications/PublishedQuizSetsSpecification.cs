using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.QuizSetAggregate.Specifications;

public sealed class PublishedQuizSetsSpecification : Specification<QuizSet>
{
    public PublishedQuizSetsSpecification(
        string? search = null,
        string? sortBy = null,
        int page = 1,
        int pageSize = 10)
    {
        var searchLower = search?.ToLower();

        // Base criteria: published and not deleted, with optional search
        Criteria = quizSet => 
            quizSet.IsPublished
            && quizSet.DeletedAt == null
            && (string.IsNullOrWhiteSpace(search) ||
                (quizSet.Title.ToLower().Contains(searchLower!) 
                 || (quizSet.Description != null && quizSet.Description.ToLower().Contains(searchLower!))));

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
