using Domain.Exceptions;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate;
using Mapster;
using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;

namespace ThinkTogether.Application.Handlers.QuizSet.Queries.GetQuizSetById;

public sealed class GetQuizSetByIdQueryHandler : IRequestHandler<GetQuizSetByIdQuery, QuizSetDto>
{
    private readonly IQuizSetRepository _repository;

    public GetQuizSetByIdQueryHandler(IQuizSetRepository repository)
    {
        _repository = repository;
    }

    public async Task<QuizSetDto> Handle(
        GetQuizSetByIdQuery request,
        CancellationToken cancellationToken)
    {
        var quizSet = await _repository.GetByIdAsync(request.Id, cancellationToken);

        if (quizSet == null)
            throw new EntityNotFoundException("QuizSet", request.Id);

        return quizSet.Adapt<QuizSetDto>();
    }
}
