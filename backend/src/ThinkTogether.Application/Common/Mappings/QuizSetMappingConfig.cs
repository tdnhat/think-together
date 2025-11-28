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
            .Map(dest => dest.QuestionCount, src => src.Questions.Count);

        config.NewConfig<Question, QuestionDto>()
            .Map(dest => dest.Options, src => src.Options.Adapt<List<QuestionOptionDto>>());

        config.NewConfig<QuestionOption, QuestionOptionDto>();
    }
}

