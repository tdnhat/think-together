namespace ThinkTogether.Application.DTOs;

public class ChallengeStatsDto
{
    public Guid ChallengeId { get; set; }
    public int TotalAttempts { get; set; }
    public int CompletedAttempts { get; set; }
    public int TotalParticipants { get; set; }
    public double AverageScore { get; set; }
    public double AverageAccuracy { get; set; }
    public double CompletionRate { get; set; }
    public int TopScore { get; set; }
    public int RecentActivityCount { get; set; } // Attempts in last 7 days
}
