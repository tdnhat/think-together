using MediatR;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Exceptions;

namespace ThinkTogether.Application.Handlers.QuizSet.Commands.DeleteQuestion;

public sealed class DeleteQuestionCommandHandler : IRequestHandler<DeleteQuestionCommand>
{
    private readonly IQuizSetRepository _repository;
    private readonly ICurrentUserService _currentUserService;

    public DeleteQuestionCommandHandler(
        IQuizSetRepository repository,
        ICurrentUserService currentUserService)
    {
        _repository = repository;
        _currentUserService = currentUserService;
    }

    public async Task Handle(
        DeleteQuestionCommand request,
        CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(_currentUserService.UserId!);

        var quizSet = await _repository.GetByIdAsync(request.QuizSetId, cancellationToken);
        if (quizSet == null)
            throw new EntityNotFoundException(nameof(QuizSet), request.QuizSetId);

        if (quizSet.CreatorId != userId)
            throw new UnauthorizedAccessException("Bạn không có quyền xóa câu hỏi trong bộ trắc nghiệm này");

        quizSet.RemoveQuestion(request.QuestionId);

        await _repository.SaveChangesAsync(cancellationToken);
    }
}

