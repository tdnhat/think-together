using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Entities;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Entities;

namespace ThinkTogether.Infrastructure.Services;

public class GameQuestionMappingService : IGameQuestionMappingService
{
    public GameQuestionDto MapToDto(GameQuestion gameQuestion, Question question)
    {
        return new GameQuestionDto
        {
            Id = question.Id,
            GameQuestionId = gameQuestion.Id,
            Content = question.Content,
            Type = question.Type,
            TimeLimit = question.TimeLimit,
            PositionInGame = gameQuestion.PositionInGame,
            VideoUrl = question.VideoUrl,
            VideoTimestamp = question.VideoTimestamp,
            Options = question.Options
                .OrderBy(o => o.DisplayOrder)
                .Select((o, index) => new GameQuestionOptionDto
                {
                    Index = index,
                    Content = o.Content,
                    ImageUrl = o.ImageUrl
                })
                .ToList()
        };
    }
}

