using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Domain.Aggregates.CategoryAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.UserAggregate.Repositories;

namespace ThinkTogether.Application.Handlers.Platform.Queries.GetPlatformStats;

public sealed class GetPlatformStatsQueryHandler : IRequestHandler<GetPlatformStatsQuery, PlatformStatsDto>
{
    private readonly IUserRepository _userRepository;
    private readonly IQuizSetRepository _quizSetRepository;
    private readonly IChallengeRepository _challengeRepository;
    private readonly IGameSessionRepository _gameSessionRepository;
    private readonly ICategoryRepository _categoryRepository;

    public GetPlatformStatsQueryHandler(
        IUserRepository userRepository,
        IQuizSetRepository quizSetRepository,
        IChallengeRepository challengeRepository,
        IGameSessionRepository gameSessionRepository,
        ICategoryRepository categoryRepository)
    {
        _userRepository = userRepository;
        _quizSetRepository = quizSetRepository;
        _challengeRepository = challengeRepository;
        _gameSessionRepository = gameSessionRepository;
        _categoryRepository = categoryRepository;
    }

    public async Task<PlatformStatsDto> Handle(GetPlatformStatsQuery request, CancellationToken cancellationToken)
    {
        // Count aggregates using repository CountAsync
        var totalUsers = await _userRepository.CountAsync(u => u.DeletedAt == null, cancellationToken);
        var totalQuizSets = await _quizSetRepository.CountAsync(q => q.DeletedAt == null, cancellationToken);
        var totalPublishedQuizSets = await _quizSetRepository.CountAsync(
            q => q.DeletedAt == null && q.IsPublished, 
            cancellationToken);
        var totalGameSessions = await _gameSessionRepository.CountAsync(
            g => g.DeletedAt == null, 
            cancellationToken);
        var totalCategories = await _categoryRepository.CountAsync(
            c => c.DeletedAt == null, 
            cancellationToken);

        // Count child entities directly from database
        var totalQuestions = await _quizSetRepository.CountQuestionsAsync(cancellationToken);
        var totalChallengeAttempts = await _challengeRepository.CountAttemptsAsync(cancellationToken);

        return new PlatformStatsDto
        {
            TotalUsers = totalUsers,
            TotalQuestions = totalQuestions,
            TotalQuizSets = totalQuizSets,
            TotalPublishedQuizSets = totalPublishedQuizSets,
            TotalChallengeAttempts = totalChallengeAttempts,
            TotalGameSessions = totalGameSessions,
            TotalCategories = totalCategories
        };
    }
}

