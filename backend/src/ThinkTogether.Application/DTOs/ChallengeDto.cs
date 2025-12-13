using ThinkTogether.Domain.Enums;

namespace ThinkTogether.Application.DTOs;

public class ChallengeDto
{
    public Guid Id { get; set; }
    public Guid CreatorId { get; set; }
    public Guid QuizSetId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string ShareLink { get; set; } = string.Empty;
    public ChallengeStatus Status { get; set; }
    public bool ShowLeaderboard { get; set; }
    public int PlayCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class ChallengeAttemptDto
{
    public Guid Id { get; set; }
    public Guid ChallengeId { get; set; }
    public Guid? UserId { get; set; }
    public string Nickname { get; set; } = string.Empty;
    public int ScoreAchieved { get; set; }
    public int CorrectAnswers { get; set; }
    public int TotalQuestions { get; set; }
    public int? CompletionTimeMs { get; set; }
    public DateTime CompletedAt { get; set; }
    public DateTime StartedAt { get; set; }
    public int CurrentQuestionIndex { get; set; }
    public AttemptStatus Status { get; set; }
    public int? TimeLimitMs { get; set; }
    public int? RemainingTimeMs { get; set; }
    public List<ChallengeQuestionDto> Questions { get; set; } = new();
    public List<Guid> FlaggedQuestionIds { get; set; } = new();
}

public class ChallengeQuestionDto
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
    public bool IsFlagged { get; set; }
    public bool IsAnswered { get; set; }
    public ChallengeAnswerDto? Answer { get; set; }
}

public class ChallengeAnswerDto
{
    public Guid Id { get; set; }
    public Guid QuestionId { get; set; }
    public int SubmissionTimeMs { get; set; }
    public bool IsCorrect { get; set; }
    public int PointsEarned { get; set; }
    public List<int> SelectedOptionIndexes { get; set; } = new();
    public List<AnswerMatchingPairDto> MatchingPairs { get; set; } = new();
    public List<AnswerOrderingItemDto> OrderingItems { get; set; } = new();
}

public class AnswerMatchingPairDto
{
    public string LeftContent { get; set; } = string.Empty;
    public string RightContent { get; set; } = string.Empty;
}

public class AnswerOrderingItemDto
{
    public string Content { get; set; } = string.Empty;
    public int Position { get; set; }
}

public class ChallengeLeaderboardEntryDto
{
    public Guid AttemptId { get; set; }
    public Guid? UserId { get; set; }
    public string Nickname { get; set; } = string.Empty;
    public int Score { get; set; }
    public int CorrectAnswers { get; set; }
    public int TotalQuestions { get; set; }
    public int? CompletionTimeMs { get; set; }
    public DateTime CompletedAt { get; set; }
    public int Rank { get; set; }
}

public class ChallengeLeaderboardDto
{
    public Guid ChallengeId { get; set; }
    public List<ChallengeLeaderboardEntryDto> Entries { get; set; } = new();
    public int TotalEntries { get; set; }
}
