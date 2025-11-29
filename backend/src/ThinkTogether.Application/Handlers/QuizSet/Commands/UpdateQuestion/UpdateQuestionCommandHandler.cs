using ThinkTogether.Domain.Aggregates.QuizSetAggregate;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Entities;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.ValueObjects;
using Mapster;
using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using Domain.Exceptions;

namespace ThinkTogether.Application.Handlers.QuizSet.Commands.UpdateQuestion;

public sealed class UpdateQuestionCommandHandler : IRequestHandler<UpdateQuestionCommand, QuestionDto>
{
    private readonly IQuizSetRepository _repository;
    private readonly ICurrentUserService _currentUserService;

    public UpdateQuestionCommandHandler(
        IQuizSetRepository repository,
        ICurrentUserService currentUserService)
    {
        _repository = repository;
        _currentUserService = currentUserService;
    }

    public async Task<QuestionDto> Handle(
        UpdateQuestionCommand request,
        CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(_currentUserService.UserId!);

        var quizSet = await _repository.GetByIdAsync(request.QuizSetId, cancellationToken);
        if (quizSet == null)
            throw new EntityNotFoundException(nameof(QuizSet), request.QuizSetId);

        if (quizSet.CreatorId != userId)
            throw new UnauthorizedAccessException("Bạn không có quyền cập nhật câu hỏi trong bộ trắc nghiệm này");

        var question = quizSet.GetQuestion(request.QuestionId);

        // Update basic properties
        if (!string.IsNullOrEmpty(request.Content))
        {
            question.UpdateContent(request.Content);
        }

        if (request.TimeLimit.HasValue)
        {
            question.UpdateTimeLimit(request.TimeLimit.Value);
        }

        if (request.DisplayOrder.HasValue)
        {
            question.UpdateDisplayOrder(request.DisplayOrder.Value);
        }

        // Update type-specific data
        switch (question.Type)
        {
            case QuestionType.SingleChoice:
            case QuestionType.TrueFalse:
            case QuestionType.MultipleChoice:
                if (request.Options != null && request.Options.Count > 0)
                {
                    var options = request.Options
                        .Select(o => QuestionOption.Create(
                            o.Content,
                            o.IsCorrect,
                            o.ImageUrl,
                            o.DisplayOrder))
                        .ToList();
                    question.SetOptions(options);
                }
                break;

            case QuestionType.Matching:
                if (request.MatchingPairs != null && request.MatchingPairs.Count > 0)
                {
                    var pairs = request.MatchingPairs
                        .Select(p => MatchingPair.Create(
                            p.LeftContent,
                            p.RightContent,
                            p.DisplayOrder))
                        .ToList();
                    question.SetMatchingPairs(pairs);
                }
                break;

            case QuestionType.Ordering:
                if (request.OrderingItems != null && request.OrderingItems.Count > 0)
                {
                    var items = request.OrderingItems
                        .Select(i => OrderingItem.Create(
                            i.Content,
                            i.CorrectPosition))
                        .ToList();
                    question.SetOrderingItems(items);
                }
                break;

            case QuestionType.Video:
                if (!string.IsNullOrEmpty(request.VideoUrl) && request.VideoTimestamp.HasValue)
                {
                    question.SetVideoDetails(request.VideoUrl, request.VideoTimestamp.Value);
                }
                break;
        }

        await _repository.SaveChangesAsync(cancellationToken);

        return question.Adapt<QuestionDto>();
    }
}

