using ThinkTogether.Domain.Aggregates.QuizSetAggregate;
using Mapster;
using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;

namespace ThinkTogether.Application.Handlers.QuizSet.Commands.CreateQuizSet;

public sealed class CreateQuizSetCommandHandler : IRequestHandler<CreateQuizSetCommand, QuizSetDto>
{
    private readonly IQuizSetRepository _repository;
    private readonly ICurrentUserService _currentUserService;

    public CreateQuizSetCommandHandler(
        IQuizSetRepository repository,
        ICurrentUserService currentUserService)
    {
        _repository = repository;
        _currentUserService = currentUserService;
    }

    public async Task<QuizSetDto> Handle(
        CreateQuizSetCommand request,
        CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(_currentUserService.UserId!);

        var quizSet = ThinkTogether.Domain.Aggregates.QuizSetAggregate.QuizSet.Create(
            userId,
            request.Title,
            request.Description);

        if (!string.IsNullOrEmpty(request.CoverImageUrl))
        {
            quizSet.UpdateCoverImageUrl(request.CoverImageUrl);
        }

        await _repository.AddAsync(quizSet, cancellationToken);
        await _repository.SaveChangesAsync(cancellationToken);

        return quizSet.Adapt<QuizSetDto>();
    }
}

