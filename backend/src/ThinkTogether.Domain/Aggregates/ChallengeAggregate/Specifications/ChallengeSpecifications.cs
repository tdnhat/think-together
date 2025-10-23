using Domain.Aggregates.ChallengeAggregate.Enums;

namespace Domain.Aggregates.ChallengeAggregate.Specifications;

public static class ChallengeSpecifications
{
    public static Func<Challenge, bool> IsActive => challenge => !challenge.IsDeleted;

    public static Func<Challenge, bool> IsStatusActive => challenge => challenge.Status == ChallengeStatus.HOAT_DONG && !challenge.IsDeleted;

    public static Func<Challenge, bool> IsArchived => challenge => challenge.Status == ChallengeStatus.LUU_TRU;

    public static Func<Challenge, bool> CreatedBy(Guid userId) => challenge => challenge.CreatorId == userId;

    public static Func<Challenge, bool> UsingQuizSet(Guid quizSetId) => challenge => challenge.QuizSetId == quizSetId;

    public static Func<Challenge, bool> HasAttempts => challenge => challenge.Attempts.Count > 0;

    public static Func<Challenge, bool> CreatedAfter(DateTime date) => challenge => challenge.CreatedAt > date;

    public static Func<Challenge, bool> IsPopular(int minPlayCount = 10) => challenge => challenge.PlayCount >= minPlayCount;
}

