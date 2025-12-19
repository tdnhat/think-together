using MediatR;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Repositories;
using ThinkTogether.Domain.Exceptions;

namespace ThinkTogether.Application.Handlers.QuizSet.Commands.ReorderQuestions;

public sealed class ReorderQuestionsCommandHandler : IRequestHandler<ReorderQuestionsCommand>
{
    private readonly IQuizSetRepository _repository;
    private readonly ICurrentUserService _currentUserService;

    public ReorderQuestionsCommandHandler(
        IQuizSetRepository repository,
        ICurrentUserService currentUserService)
    {
        _repository = repository;
        _currentUserService = currentUserService;
    }

    public async Task Handle(
        ReorderQuestionsCommand request,
        CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(_currentUserService.UserId!);

        var quizSet = await _repository.GetByIdAsync(request.QuizSetId, cancellationToken);
        if (quizSet == null)
            throw new EntityNotFoundException(nameof(QuizSet), request.QuizSetId);

        if (quizSet.CreatorId != userId)
            throw new ForbiddenException("Bạn không có quyền sắp xếp lại câu hỏi trong bộ trắc nghiệm này");

        foreach (var order in request.Questions)
        {
            var question = quizSet.GetQuestion(order.QuestionId);
            question.UpdateDisplayOrder(order.DisplayOrder);
        }

        await _repository.SaveChangesAsync(cancellationToken);
    }
}
