using MediatR;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Repositories;
using ThinkTogether.Domain.Exceptions;
using ThinkTogether.Shared.Common;

namespace ThinkTogether.Application.Handlers.QuizSet.Commands.PublishQuizSet;

public sealed class PublishQuizSetCommandHandler : IRequestHandler<PublishQuizSetCommand>
{
    private readonly IQuizSetRepository _repository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IUnitOfWork _unitOfWork;

    public PublishQuizSetCommandHandler(
        IQuizSetRepository repository,
        ICurrentUserService currentUserService,
        IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _currentUserService = currentUserService;
        _unitOfWork = unitOfWork;
    }

    public async Task Handle(
        PublishQuizSetCommand request,
        CancellationToken cancellationToken)
    {
        var quizSet = await _repository.GetByIdAsync(request.Id, cancellationToken);

        if (quizSet == null)
            throw new EntityNotFoundException(nameof(QuizSet), request.Id);

        // Check if user is the creator
        if (quizSet.CreatorId != Guid.Parse(_currentUserService.UserId!))
            throw new ForbiddenException("Bạn chỉ có thể xuất bản bộ câu hỏi của mình");

        quizSet.Publish();

        await _repository.UpdateAsync(quizSet, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
