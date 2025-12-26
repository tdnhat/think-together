using Mapster;
using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Specifications;
using ThinkTogether.Domain.Aggregates.UserAggregate.Repositories;
using ThinkTogether.Shared.Common;

namespace ThinkTogether.Application.Handlers.QuizSet.Queries.GetAllQuizSets;

public sealed class GetAllQuizSetsQueryHandler : IRequestHandler<GetAllQuizSetsQuery, PaginatedResponse<QuizSetDto>>
{
    private readonly IQuizSetRepository _repository;
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetAllQuizSetsQueryHandler(
        IQuizSetRepository repository,
        IUserRepository userRepository,
        ICurrentUserService currentUserService)
    {
        _repository = repository;
        _userRepository = userRepository;
        _currentUserService = currentUserService;
    }

    public async Task<PaginatedResponse<QuizSetDto>> Handle(
        GetAllQuizSetsQuery request,
        CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(_currentUserService.UserId!);

        var spec = new QuizSetsByCreatorIdSpecification(
            userId,
            request.Search,
            request.FilterBy,
            request.SortBy,
            request.Page,
            request.PageSize);

        var (quizSets, total) = await _repository.GetBySpecificationAsync(spec, cancellationToken);

        var creator = await _userRepository.GetByIdAsync(userId, cancellationToken);
        var creatorName = creator != null ? $"{creator.FirstName} {creator.LastName}".Trim() : "Unknown Creator";

        var dtos = quizSets.Adapt<List<QuizSetDto>>();
        foreach (var dto in dtos)
        {
            dto.CreatorName = creatorName;
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

