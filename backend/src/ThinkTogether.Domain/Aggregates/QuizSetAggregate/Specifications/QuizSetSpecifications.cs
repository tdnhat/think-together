using System.Linq.Expressions;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Entities;

namespace ThinkTogether.Domain.Aggregates.QuizSetAggregate.Specifications;

public static class QuizSetSpecifications
{
    public static Expression<Func<QuizSet, bool>> IsActive => 
        quizSet => quizSet.DeletedAt == null;

    public static Expression<Func<QuizSet, bool>> IsPublished => 
        quizSet => quizSet.IsPublished;

    public static Expression<Func<QuizSet, bool>> CreatedBy(Guid creatorId) => 
        quizSet => quizSet.CreatorId == creatorId;

    public static Expression<Func<QuizSet, bool>> HasTitleContaining(string search) => 
        quizSet => quizSet.Title.ToLower().Contains(search.ToLower());

    public static Expression<Func<QuizSet, bool>> HasDescriptionContaining(string search) => 
        quizSet => quizSet.Description != null && quizSet.Description.ToLower().Contains(search.ToLower());

    public static Expression<Func<QuizSet, bool>> ContainsText(string search)
    {
        var searchLower = search.ToLower();
        return quizSet => quizSet.Title.ToLower().Contains(searchLower) 
            || (quizSet.Description != null && quizSet.Description.ToLower().Contains(searchLower));
    }
}
