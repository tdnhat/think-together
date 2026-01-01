using Mapster;
using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Specifications;
using ThinkTogether.Domain.Aggregates.UserAggregate.Repositories;

namespace ThinkTogether.Application.Handlers.Dashboard.Queries.GetRecentActivity;

public sealed class GetRecentActivityQueryHandler : IRequestHandler<GetRecentActivityQuery, List<QuizSetDto>>
{
    private readonly IQuizSetRepository _quizSetRepository;
    private readonly IUserRepository _userRepository;

    public GetRecentActivityQueryHandler(
        IQuizSetRepository quizSetRepository,
        IUserRepository userRepository)
    {
        _quizSetRepository = quizSetRepository;
        _userRepository = userRepository;
    }

    public async Task<List<QuizSetDto>> Handle(GetRecentActivityQuery request, CancellationToken cancellationToken)
    {
        var recentSpec = new RecentQuizSetsSpecification(5);
        var (recentEntities, _) = await _quizSetRepository.GetBySpecificationAsync(recentSpec, cancellationToken);

        var recentDtos = recentEntities.Adapt<List<QuizSetDto>>();

        if (recentDtos.Any())
        {
            var creatorIds = recentEntities.Select(q => q.CreatorId).Distinct().ToList();
            var creators = await _userRepository.GetByIdsAsync(creatorIds, cancellationToken);
            var creatorMap = creators.ToDictionary(u => u.Id, u => u.GetFullName());

            foreach (var dto in recentDtos)
            {
                if (creatorMap.TryGetValue(dto.CreatorId, out var name))
                {
                    dto.CreatorName = name;
                }
            }
        }

        return recentDtos;
    }
}
