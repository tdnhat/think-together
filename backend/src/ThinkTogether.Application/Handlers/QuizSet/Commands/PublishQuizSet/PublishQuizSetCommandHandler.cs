using MediatR;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Exceptions;

namespace ThinkTogether.Application.Handlers.QuizSet.Commands.PublishQuizSet;

public sealed class PublishQuizSetCommandHandler : IRequestHandler<PublishQuizSetCommand>
{
    private readonly IQuizSetRepository _repository;
    private readonly ICurrentUserService _currentUserService;

    public PublishQuizSetCommandHandler(
        IQuizSetRepository repository,
        ICurrentUserService currentUserService)
    {
        _repository = repository;
        _currentUserService = currentUserService;
    }

    public async Task Handle(
        PublishQuizSetCommand request,
        CancellationToken cancellationToken)
    {
        var quizSet = await _repository.GetByIdAsync(request.Id, cancellationToken);

        if (quizSet == null)
            throw new EntityNotFoundException("QuizSet", request.Id);

        // Check if user is the creator
        if (quizSet.CreatorId != Guid.Parse(_currentUserService.UserId!))
            throw new ForbiddenException("Bạn chỉ có thể xuất bản bộ câu hỏi của mình");

        quizSet.Publish();

        await _repository.UpdateAsync(quizSet, cancellationToken);
        await _repository.SaveChangesAsync(cancellationToken);
    }
}
