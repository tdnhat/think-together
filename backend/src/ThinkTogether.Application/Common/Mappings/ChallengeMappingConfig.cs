using Mapster;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Entities;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Entities;

namespace ThinkTogether.Application.Common.Mappings;

public sealed class ChallengeMappingConfig : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        // Challenge -> ChallengeDto
        config.NewConfig<Challenge, ChallengeDto>()
            .Map(dest => dest.Id, src => src.Id)
            .Map(dest => dest.CreatorId, src => src.CreatorId)
            .Map(dest => dest.QuizSetId, src => src.QuizSetId)
            .Map(dest => dest.Title, src => src.Title)
            .Map(dest => dest.Description, src => src.Description)
            .Map(dest => dest.ShareLink, src => src.ShareLink)
            .Map(dest => dest.Status, src => src.Status)
            .Map(dest => dest.ShowLeaderboard, src => src.ShowLeaderboard)
            .Map(dest => dest.PlayCount, src => src.PlayCount)
            .Map(dest => dest.CreatedAt, src => src.CreatedAt)
            .Map(dest => dest.UpdatedAt, src => src.UpdatedAt);

        // ChallengeAttempt -> ChallengeAttemptDto
        config.NewConfig<ChallengeAttempt, ChallengeAttemptDto>()
            .Map(dest => dest.Id, src => src.Id)
            .Map(dest => dest.ChallengeId, src => src.ChallengeId)
            .Map(dest => dest.UserId, src => src.UserId)
            .Map(dest => dest.Nickname, src => src.Nickname)
            .Map(dest => dest.ScoreAchieved, src => src.ScoreAchieved)
            .Map(dest => dest.CorrectAnswers, src => src.CorrectAnswers)
            .Map(dest => dest.TotalQuestions, src => src.TotalQuestions)
            .Map(dest => dest.CompletionTimeMs, src => src.CompletionTimeMs)
            .Map(dest => dest.CompletedAt, src => src.CompletedAt)
            .Map(dest => dest.StartedAt, src => src.StartedAt)
            .Map(dest => dest.Status, src => src.Status)
            .Map(dest => dest.TimeLimitMs, src => src.TimeLimitMs)
            .Map(dest => dest.RemainingTimeMs, src => src.GetRemainingTimeMs())
            .Map(dest => dest.Questions, src => (List<ChallengeQuestionDto>)null!); // Will be set manually when needed

        // Question -> ChallengeQuestionDto (for challenge attempts)
        // Note: IsCorrect and CorrectPosition are hidden during attempts, shown after completion
        config.NewConfig<Question, ChallengeQuestionDto>()
            .Map(dest => dest.Id, src => src.Id)
            .Map(dest => dest.QuizSetId, src => src.QuizSetId)
            .Map(dest => dest.Content, src => src.Content)
            .Map(dest => dest.Type, src => src.Type)
            .Map(dest => dest.TimeLimit, src => src.TimeLimit)
            .Map(dest => dest.DisplayOrder, src => src.DisplayOrder)
            .Map(dest => dest.VideoUrl, src => src.VideoUrl)
            .Map(dest => dest.VideoTimestamp, src => src.VideoTimestamp)
            .Map(dest => dest.AudioUrl, src => src.AudioUrl)
            .Map(dest => dest.AudioTimestamp, src => src.AudioTimestamp)
            .Map(dest => dest.Options, src => src.Options.OrderBy(o => o.DisplayOrder)
                .Select(o => new QuestionOptionDto
                {
                    Content = o.Content,
                    IsCorrect = false, // Hidden during attempt
                    DisplayOrder = o.DisplayOrder,
                    ImageUrl = o.ImageUrl
                }).ToList())
            .Map(dest => dest.MatchingPairs, src => src.MatchingPairs.OrderBy(p => p.DisplayOrder).Adapt<List<MatchingPairDto>>())
            .Map(dest => dest.OrderingItems, src => src.OrderingItems.OrderBy(i => i.CorrectPosition)
                .Select(i => new OrderingItemDto
                {
                    Content = i.Content,
                    CorrectPosition = 0 // Hidden during attempt
                }).ToList());

        // AnswerMatchingPair -> AnswerMatchingPairDto
        config.NewConfig<AnswerMatchingPair, AnswerMatchingPairDto>()
            .Map(dest => dest.LeftContent, src => src.LeftContent)
            .Map(dest => dest.RightContent, src => src.RightContent);

        // AnswerOrderingItem -> AnswerOrderingItemDto
        config.NewConfig<AnswerOrderingItem, AnswerOrderingItemDto>()
            .Map(dest => dest.Content, src => src.Content)
            .Map(dest => dest.Position, src => src.Position);

    }
}

