using ThinkTogether.Domain.Aggregates.QuizSetAggregate;
using Mapster;
using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.UserAggregate.Repositories;

namespace ThinkTogether.Application.Handlers.QuizSet.Commands.CreateQuizSet;

public sealed class CreateQuizSetCommandHandler : IRequestHandler<CreateQuizSetCommand, QuizSetDto>
{
    private readonly IQuizSetRepository _repository;
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;

    public CreateQuizSetCommandHandler(
        IQuizSetRepository repository,
        IUserRepository userRepository,
        ICurrentUserService currentUserService)
    {
        _repository = repository;
        _userRepository = userRepository;
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

        var creator = await _userRepository.GetByIdAsync(userId, cancellationToken);

        var dto = quizSet.Adapt<QuizSetDto>();
        dto.CreatorName = creator != null ? $"{creator.FirstName} {creator.LastName}".Trim() : "Unknown Creator";

        return dto;
    }
}

