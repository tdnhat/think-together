using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Domain.Aggregates.CategoryAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.UserAggregate.Repositories;

namespace ThinkTogether.Application.Handlers.Dashboard.Queries.GetDashboardCounts;

public sealed class GetDashboardCountsQueryHandler : IRequestHandler<GetDashboardCountsQuery, DashboardCountsDto>
{
    private readonly IUserRepository _userRepository;
    private readonly IQuizSetRepository _quizSetRepository;
    private readonly ICategoryRepository _categoryRepository;

    public GetDashboardCountsQueryHandler(
        IUserRepository userRepository,
        IQuizSetRepository quizSetRepository,
        ICategoryRepository categoryRepository)
    {
        _userRepository = userRepository;
        _quizSetRepository = quizSetRepository;
        _categoryRepository = categoryRepository;
    }

    public async Task<DashboardCountsDto> Handle(GetDashboardCountsQuery request, CancellationToken cancellationToken)
    {
        var today = DateTime.UtcNow.Date;

        // User Stats
        var totalUsers = await _userRepository.CountAsync(cancellationToken);
        var newUsersToday = await _userRepository.CountCreatedAfterAsync(today, cancellationToken);
        
        // Quiz Stats
        var totalQuizzes = await _quizSetRepository.CountAsync(cancellationToken);
        var newQuizzesToday = await _quizSetRepository.CountCreatedAfterAsync(today, cancellationToken);
        
        // Category Stats
        var totalCategories = await _categoryRepository.CountAsync(cancellationToken);

        return new DashboardCountsDto
        {
            TotalQuizzes = totalQuizzes,
            NewQuizzesToday = newQuizzesToday,
            TotalUsers = totalUsers,
            NewUsersToday = newUsersToday,
            TotalCategories = totalCategories,
            ActiveUsersToday = 0
        };
    }
}
