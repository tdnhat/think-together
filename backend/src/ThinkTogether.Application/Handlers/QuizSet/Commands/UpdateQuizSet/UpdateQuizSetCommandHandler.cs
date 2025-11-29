using Domain.Exceptions;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate;
using Mapster;
using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;

namespace ThinkTogether.Application.Handlers.QuizSet.Commands.UpdateQuizSet;

public sealed class UpdateQuizSetCommandHandler : IRequestHandler<UpdateQuizSetCommand, QuizSetDto>
{
    private readonly IQuizSetRepository _repository;
    private readonly ICurrentUserService _currentUserService;

    public UpdateQuizSetCommandHandler(
        IQuizSetRepository repository,
        ICurrentUserService currentUserService)
    {
        _repository = repository;
        _currentUserService = currentUserService;
    }

    public async Task<QuizSetDto> Handle(
        UpdateQuizSetCommand request,
        CancellationToken cancellationToken)
    {
        var quizSet = await _repository.GetByIdAsync(request.Id, cancellationToken);

        if (quizSet == null)
            throw new EntityNotFoundException("QuizSet", request.Id);

        // Check if user is the creator
        if (quizSet.CreatorId != Guid.Parse(_currentUserService.UserId!))
            throw new ForbiddenException("Bạn chỉ có thể cập nhật bộ câu hỏi của mình");

        if (!string.IsNullOrWhiteSpace(request.Title))
            quizSet.UpdateTitle(request.Title);

        if (request.Description != null)
            quizSet.UpdateDescription(request.Description);

        if (request.CoverImageUrl != null)
            quizSet.UpdateCoverImageUrl(request.CoverImageUrl);

        await _repository.UpdateAsync(quizSet, cancellationToken);
        await _repository.SaveChangesAsync(cancellationToken);

        return quizSet.Adapt<QuizSetDto>();
    }
}
