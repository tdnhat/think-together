namespace ThinkTogether.Application.DTOs;

public record DashboardCountsDto
{
    public int TotalQuizzes { get; init; }
    public int NewQuizzesToday { get; init; }
    public int TotalUsers { get; init; }
    public int NewUsersToday { get; init; }
    public int TotalCategories { get; init; }
    public int ActiveUsersToday { get; init; } // Placeholder
}

public record DashboardChartsDto
{
    public List<ChartDataDto> QuizTrends { get; init; } = new();
    public List<ChartDataDto> UserTrends { get; init; } = new();
    public List<CategoryDistributionDto> CategoryDistribution { get; init; } = new();
}

public record ChartDataDto(string Label, int Value);

public record CategoryDistributionDto(string Name, int Value);
