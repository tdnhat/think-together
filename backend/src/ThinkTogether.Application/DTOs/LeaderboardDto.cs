using ThinkTogether.Domain.Enums;

namespace ThinkTogether.Application.DTOs;

public class GlobalLeaderboardEntryDto
{
    public Guid AttemptId { get; set; }
    public Guid? UserId { get; set; }
    public string Nickname { get; set; } = string.Empty;
    public int Score { get; set; }
    public int CorrectAnswers { get; set; }
    public int TotalQuestions { get; set; }
    public int? CompletionTimeMs { get; set; }
    public DateTime CompletedAt { get; set; }
    public Guid? QuizSetId { get; set; }
    public string? QuizSetTitle { get; set; }
    public Guid? ChallengeId { get; set; }
    public string? ChallengeTitle { get; set; }
    public int Rank { get; set; }
    
    // Homework/Class related fields
    public bool IsHomework { get; set; }
    public Guid? HomeworkId { get; set; }
    public string? HomeworkTitle { get; set; }
    public Guid? ClassId { get; set; }
    public string? ClassName { get; set; }
    public SubmissionStatus? SubmissionStatus { get; set; }
}

public class LeaderboardDto
{
    public List<GlobalLeaderboardEntryDto> Entries { get; set; } = new();
    public int TotalEntries { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
}

public class LeaderboardStatsDto
{
    public int TotalAttempts { get; set; }
    public int TotalParticipants { get; set; }
    public double AverageScore { get; set; }
    public double AverageAccuracy { get; set; }
    public int? AverageCompletionTimeMs { get; set; }
    public double CompletionRate { get; set; }
    public int TopScore { get; set; }
    public int RecentActivityCount { get; set; }
}
