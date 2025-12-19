using Mapster;
using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.UserAggregate.Repositories;
using ThinkTogether.Domain.Exceptions;

namespace ThinkTogether.Application.Handlers.QuizSet.Queries.GetQuizSetById;

public sealed class GetQuizSetByIdQueryHandler : IRequestHandler<GetQuizSetByIdQuery, QuizSetDto>
{
    private readonly IQuizSetRepository _repository;
    private readonly IUserRepository _userRepository;

    public GetQuizSetByIdQueryHandler(IQuizSetRepository repository, IUserRepository userRepository)
    {
        _repository = repository;
        _userRepository = userRepository;
    }

    public async Task<QuizSetDto> Handle(
        GetQuizSetByIdQuery request,
        CancellationToken cancellationToken)
    {
        var quizSet = await _repository.GetByIdAsync(request.Id, cancellationToken);

        if (quizSet == null)
            throw new EntityNotFoundException("QuizSet", request.Id);

        var creator = await _userRepository.GetByIdAsync(quizSet.CreatorId, cancellationToken);

        var dto = quizSet.Adapt<QuizSetDto>();
        dto.CreatorName = creator != null ? $"{creator.FirstName} {creator.LastName}".Trim() : "Unknown Creator";

        return dto;
    }
}
