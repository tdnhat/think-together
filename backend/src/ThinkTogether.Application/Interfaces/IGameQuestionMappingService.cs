using ThinkTogether.Application.DTOs;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Entities;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Entities;

namespace ThinkTogether.Application.Interfaces;

public interface IGameQuestionMappingService
{
    GameQuestionDto MapToDto(GameQuestion gameQuestion, Question question);
}

