using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.UserAggregate.Repositories;

namespace ThinkTogether.Application.Handlers.Dashboard.Queries.GetDashboardCharts;

public sealed class GetDashboardChartsQueryHandler : IRequestHandler<GetDashboardChartsQuery, DashboardChartsDto>
{
    private readonly IUserRepository _userRepository;
    private readonly IQuizSetRepository _quizSetRepository;

    public GetDashboardChartsQueryHandler(
        IUserRepository userRepository,
        IQuizSetRepository quizSetRepository)
    {
        _userRepository = userRepository;
        _quizSetRepository = quizSetRepository;
    }

    public async Task<DashboardChartsDto> Handle(GetDashboardChartsQuery request, CancellationToken cancellationToken)
    {
        var sixMonthsAgo = DateTime.UtcNow.AddMonths(-5).Date;
        sixMonthsAgo = new DateTime(sixMonthsAgo.Year, sixMonthsAgo.Month, 1); // Start of month

        var userTrendsStats = await _userRepository.GetCreationStatsAsync(sixMonthsAgo, DateTime.UtcNow, cancellationToken);
        var quizTrendsStats = await _quizSetRepository.GetCreationStatsAsync(sixMonthsAgo, DateTime.UtcNow, cancellationToken);
        var categoryRecap = await _quizSetRepository.GetCountsByCategoryAsync(cancellationToken);

        var userTrends = ProcessTrends(userTrendsStats);
        var quizTrends = ProcessTrends(quizTrendsStats);

        return new DashboardChartsDto
        {
            QuizTrends = quizTrends,
            UserTrends = userTrends,
            CategoryDistribution = categoryRecap
                .Select(kv => new CategoryDistributionDto(kv.Key, kv.Value))
                .OrderByDescending(x => x.Value)
                .Take(5)
                .ToList()
        };
    }

    private List<ChartDataDto> ProcessTrends(Dictionary<DateTime, int> stats)
    {
        var result = new List<ChartDataDto>();
        // Check last 6 months
        for (int i = 5; i >= 0; i--)
        {
            var date = DateTime.UtcNow.AddMonths(-i);
            var key = new DateTime(date.Year, date.Month, 1);
            var label = key.ToString("MMM"); // Jan, Feb...
            
            stats.TryGetValue(key, out var count);
            result.Add(new ChartDataDto(label, count));
        }
        return result;
    }
}
