using Mapster;
using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Specifications;
using ThinkTogether.Domain.Aggregates.UserAggregate.Repositories;
using ThinkTogether.Shared.Common;

namespace ThinkTogether.Application.Handlers.QuizSet.Queries.GetPublicQuizzes;

public sealed class GetPublicQuizzesQueryHandler : IRequestHandler<GetPublicQuizzesQuery, PaginatedResponse<QuizSetDto>>
{
    private readonly IQuizSetRepository _repository;
    private readonly IUserRepository _userRepository;

    public GetPublicQuizzesQueryHandler(IQuizSetRepository repository, IUserRepository userRepository)
    {
        _repository = repository;
        _userRepository = userRepository;
    }

    public async Task<PaginatedResponse<QuizSetDto>> Handle(
        GetPublicQuizzesQuery request,
        CancellationToken cancellationToken)
    {
        var spec = new PublishedQuizSetsSpecification(
            request.Search,
            request.SortBy,
            request.Page,
            request.PageSize);

        var (quizSets, total) = await _repository.GetBySpecificationAsync(spec, cancellationToken);

        // Get creator information for the quiz sets
        var creatorIds = quizSets.Select(q => q.CreatorId).Distinct().ToList();
        var creatorDict = new Dictionary<Guid, string>();

        foreach (var creatorId in creatorIds)
        {
            var creator = await _userRepository.GetByIdAsync(creatorId, cancellationToken);
            if (creator != null)
            {
                creatorDict[creatorId] = $"{creator.FirstName} {creator.LastName}".Trim();
            }
        }

        var dtos = quizSets.Adapt<List<QuizSetDto>>();
        foreach (var dto in dtos)
        {
            dto.CreatorName = creatorDict.TryGetValue(dto.CreatorId, out var name) ? name : "Unknown Creator";
        }

        return new PaginatedResponse<QuizSetDto>
        {
            Data = dtos,
            Total = total,
            Page = request.Page,
            PageSize = request.PageSize,
        };
    }
}

