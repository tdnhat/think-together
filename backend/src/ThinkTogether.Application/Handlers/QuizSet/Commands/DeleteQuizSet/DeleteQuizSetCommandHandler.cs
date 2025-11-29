using Domain.Exceptions;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate;
using MediatR;
using ThinkTogether.Application.Interfaces;

namespace ThinkTogether.Application.Handlers.QuizSet.Commands.DeleteQuizSet;

public sealed class DeleteQuizSetCommandHandler : IRequestHandler<DeleteQuizSetCommand>
{
    private readonly IQuizSetRepository _repository;
    private readonly ICurrentUserService _currentUserService;

    public DeleteQuizSetCommandHandler(
        IQuizSetRepository repository,
        ICurrentUserService currentUserService)
    {
        _repository = repository;
        _currentUserService = currentUserService;
    }

    public async Task Handle(
        DeleteQuizSetCommand request,
        CancellationToken cancellationToken)
    {
        var quizSet = await _repository.GetByIdAsync(request.Id, cancellationToken);

        if (quizSet == null)
            throw new EntityNotFoundException("QuizSet", request.Id);

        // Check if user is the creator
        if (quizSet.CreatorId != Guid.Parse(_currentUserService.UserId!))
            throw new ForbiddenException("Bạn chỉ có thể xóa bộ câu hỏi của mình");

        await _repository.DeleteAsync(request.Id, cancellationToken);
        await _repository.SaveChangesAsync(cancellationToken);
    }
}
