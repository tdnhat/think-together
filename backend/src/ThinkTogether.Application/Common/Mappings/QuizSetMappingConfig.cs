using ThinkTogether.Domain.Aggregates.QuizSetAggregate;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Entities;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.ValueObjects;
using Mapster;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Common.Mappings;

public class QuizSetMappingConfig : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<QuizSet, QuizSetDto>()
            .Map(dest => dest.QuestionCount, src => src.Questions.Count(q => q.DeletedAt == null));

        config.NewConfig<Question, QuestionDto>()
            .Map(dest => dest.Options, src => src.Options.OrderBy(o => o.DisplayOrder).Adapt<List<QuestionOptionDto>>())
            .Map(dest => dest.MatchingPairs, src => src.MatchingPairs.OrderBy(p => p.DisplayOrder).Adapt<List<MatchingPairDto>>())
            .Map(dest => dest.OrderingItems, src => src.OrderingItems.OrderBy(i => i.CorrectPosition).Adapt<List<OrderingItemDto>>());

        config.NewConfig<QuestionOption, QuestionOptionDto>()
            .Map(dest => dest.Content, src => src.Content)
            .Map(dest => dest.IsCorrect, src => src.IsCorrect)
            .Map(dest => dest.DisplayOrder, src => src.DisplayOrder)
            .Map(dest => dest.ImageUrl, src => src.ImageUrl);

        config.NewConfig<MatchingPair, MatchingPairDto>()
            .Map(dest => dest.LeftContent, src => src.LeftContent)
            .Map(dest => dest.RightContent, src => src.RightContent)
            .Map(dest => dest.DisplayOrder, src => src.DisplayOrder);

        config.NewConfig<OrderingItem, OrderingItemDto>()
            .Map(dest => dest.Content, src => src.Content)
            .Map(dest => dest.CorrectPosition, src => src.CorrectPosition);
    }
}

