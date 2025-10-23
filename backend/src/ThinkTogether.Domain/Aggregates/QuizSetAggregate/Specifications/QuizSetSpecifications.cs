namespace Domain.Aggregates.QuizSetAggregate.Specifications;

public static class QuizSetSpecifications
{
    public static Func<QuizSet, bool> IsActive => quizSet => !quizSet.IsDeleted;

    public static Func<QuizSet, bool> IsPublished => quizSet => quizSet.IsPublished && !quizSet.IsDeleted;

    public static Func<QuizSet, bool> OwnedBy(Guid userId) => quizSet => quizSet.UserId == userId;

    public static Func<QuizSet, bool> HasQuestions => quizSet => quizSet.GetQuestionCount() > 0;

    public static Func<QuizSet, bool> CreatedAfter(DateTime date) => quizSet => quizSet.CreatedAt > date;
    
    public static Func<QuizSet, bool> CanBePublished => quizSet => !quizSet.IsDeleted && quizSet.GetQuestionCount() > 0;
}