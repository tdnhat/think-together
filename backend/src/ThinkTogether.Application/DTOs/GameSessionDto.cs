using ThinkTogether.Domain.Enums;

namespace ThinkTogether.Application.DTOs;

public record GameSessionDto
{
    public Guid Id { get; init; }
    public Guid HostUserId { get; init; }
    public Guid QuizSetId { get; init; }
    public string PIN { get; init; } = string.Empty;
    public GameStatus Status { get; init; }
    public int CurrentQuestionIndex { get; init; }
    public int TotalQuestions { get; init; }
    public GameQuestionDto? CurrentQuestion { get; init; }
    public DateTime? StartedAt { get; init; }
    public DateTime? EndedAt { get; init; }
    public List<GamePlayerDto> Players { get; init; } = new();
}

public record GamePlayerDto
{
    public Guid Id { get; init; }
    public string Nickname { get; init; } = string.Empty;
    public ConnectionStatus ConnectionStatus { get; init; }
    public int TotalPoints { get; init; }
    public int? Rank { get; init; }
}

public record GameQuestionDto
{
    public Guid Id { get; init; }
    public Guid GameQuestionId { get; init; }
    public string Content { get; init; } = string.Empty;
    public QuestionType Type { get; init; }
    public int TimeLimit { get; init; }
    public int PositionInGame { get; init; }
    public string? VideoUrl { get; init; }
    public int? VideoTimestamp { get; init; }
    public string? AudioUrl { get; init; }
    public int? AudioTimestamp { get; init; }
    public List<GameQuestionOptionDto> Options { get; init; } = new();
    public List<GameMatchingItemDto> MatchingLeft { get; init; } = new();
    public List<GameMatchingItemDto> MatchingRight { get; init; } = new();
    public List<GameOrderingItemDto> OrderingItems { get; init; } = new();
}

public record GameQuestionOptionDto
{
    public int Index { get; init; }
    public string Content { get; init; } = string.Empty;
    public string? ImageUrl { get; init; }
}

public record GameMatchingItemDto
{
    public int Id { get; init; }
    public string Content { get; init; } = string.Empty;
}

public record GameOrderingItemDto
{
    public int Id { get; init; }
    public string Content { get; init; } = string.Empty;
}

public record GameQuestionWithAnswerDto : GameQuestionDto
{
    public List<int> CorrectOptionIndexes { get; init; } = new();
}

public record LeaderboardEntryDto
{
    public Guid PlayerId { get; init; }
    public string Nickname { get; init; } = string.Empty;
    public int TotalPoints { get; init; }
    public int CorrectAnswers { get; init; }
    public int Rank { get; init; }
    public decimal AccuracyPercentage { get; init; }
    public long? TotalTimeSpentMs { get; init; }
}

public record AnswerResultDto
{
    public bool IsCorrect { get; init; }
    public int PointsEarned { get; init; }
    public int TotalPoints { get; init; }
    public int CurrentRank { get; init; }
    public int ResponseTimeMs { get; init; }
}

public record GameResultDto
{
    public Guid GameSessionId { get; init; }
    public int TotalQuestions { get; init; }
    public int TotalPlayers { get; init; }
    public DateTime StartedAt { get; init; }
    public DateTime EndedAt { get; init; }
    public TimeSpan Duration { get; init; }
    public List<LeaderboardEntryDto> FinalLeaderboard { get; init; } = new();
}

