using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Entities;
using ThinkTogether.Domain.Enums;

namespace ThinkTogether.Application.DTOs;

public class QuestionDto
{
    public Guid Id { get; set; }
    public Guid QuizSetId { get; set; }
    public string Content { get; set; } = string.Empty;
    public QuestionType Type { get; set; }
    public int TimeLimit { get; set; }
    public int DisplayOrder { get; set; }
    public string? VideoUrl { get; set; }
    public int? VideoTimestamp { get; set; }
    public string? AudioUrl { get; set; }
    public int? AudioTimestamp { get; set; }
    public List<QuestionOptionDto>? Options { get; set; }
    public List<MatchingPairDto>? MatchingPairs { get; set; }
    public List<OrderingItemDto>? OrderingItems { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class QuestionOptionDto
{
    public string Content { get; set; } = string.Empty;
    public bool IsCorrect { get; set; }
    public int DisplayOrder { get; set; }
    public string? ImageUrl { get; set; }
}

public class MatchingPairDto
{
    public string LeftContent { get; set; } = string.Empty;
    public string RightContent { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
}

public class OrderingItemDto
{
    public string Content { get; set; } = string.Empty;
    public int CorrectPosition { get; set; }
}

