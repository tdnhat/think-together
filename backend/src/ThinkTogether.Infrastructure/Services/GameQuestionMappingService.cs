using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Entities;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Entities;
using ThinkTogether.Domain.Enums;

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
            AudioUrl = question.AudioUrl,
            AudioTimestamp = question.AudioTimestamp,
            Options = question.Options
                .OrderBy(o => o.DisplayOrder)
                .Select((o, index) => new GameQuestionOptionDto
                {
                    Index = index,
                    Content = o.Content,
                    ImageUrl = o.ImageUrl
                })
                .ToList(),
            MatchingLeft = question.Type == QuestionType.Matching
                ? question.MatchingPairs
                    .Select((p, index) => new GameMatchingItemDto
                    {
                        Id = index,
                        Content = p.LeftContent
                    })
                    .ToList()
                : new List<GameMatchingItemDto>(),
            MatchingRight = question.Type == QuestionType.Matching
                ? question.MatchingPairs
                    .Select((p, index) => new GameMatchingItemDto
                    {
                        Id = index,
                        Content = p.RightContent
                    })
                    .ToList()
                : new List<GameMatchingItemDto>(),
            OrderingItems = question.Type == QuestionType.Ordering
                ? question.OrderingItems
                    .Select((o, index) => new GameOrderingItemDto
                    {
                        Id = index,
                        Content = o.Content
                    })
                    .ToList()
                : new List<GameOrderingItemDto>()
        };
    }
}

