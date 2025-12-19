using Mapster;
using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Entities;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.ValueObjects;
using ThinkTogether.Domain.Enums;
using ThinkTogether.Domain.Exceptions;

namespace ThinkTogether.Application.Handlers.QuizSet.Commands.DuplicateQuestion;

public sealed class DuplicateQuestionCommandHandler : IRequestHandler<DuplicateQuestionCommand, QuestionDto>
{
    private readonly IQuizSetRepository _repository;
    private readonly ICurrentUserService _currentUserService;

    public DuplicateQuestionCommandHandler(
        IQuizSetRepository repository,
        ICurrentUserService currentUserService)
    {
        _repository = repository;
        _currentUserService = currentUserService;
    }

    public async Task<QuestionDto> Handle(
        DuplicateQuestionCommand request,
        CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(_currentUserService.UserId!);

        var quizSet = await _repository.GetByIdAsync(request.QuizSetId, cancellationToken);
        if (quizSet == null)
            throw new EntityNotFoundException(nameof(QuizSet), request.QuizSetId);

        if (quizSet.CreatorId != userId)
            throw new ForbiddenException("Bạn không có quyền sao chép câu hỏi trong bộ trắc nghiệm này");

        var originalQuestion = quizSet.GetQuestion(request.QuestionId);

        var duplicatedQuestion = Question.Create(
            request.QuizSetId,
            originalQuestion.Content,
            originalQuestion.Type,
            originalQuestion.TimeLimit,
            quizSet.Questions.Count);

        switch (originalQuestion.Type)
        {
            case QuestionType.SingleChoice:
            case QuestionType.TrueFalse:
            case QuestionType.MultipleChoice:
                if (originalQuestion.Options.Any())
                {
                    var newOptions = originalQuestion.Options
                        .Select(o => QuestionOption.Create(o.Content, o.IsCorrect, o.ImageUrl, o.DisplayOrder))
                        .ToList();
                    duplicatedQuestion.SetOptions(newOptions);
                }
                break;

            case QuestionType.Matching:
                if (originalQuestion.MatchingPairs.Any())
                {
                    var newPairs = originalQuestion.MatchingPairs
                        .Select(p => MatchingPair.Create(p.LeftContent, p.RightContent, p.DisplayOrder))
                        .ToList();
                    duplicatedQuestion.SetMatchingPairs(newPairs);
                }
                break;

            case QuestionType.Ordering:
                if (originalQuestion.OrderingItems.Any())
                {
                    var newItems = originalQuestion.OrderingItems
                        .Select(i => OrderingItem.Create(i.Content, i.CorrectPosition))
                        .ToList();
                    duplicatedQuestion.SetOrderingItems(newItems);
                }
                break;

            case QuestionType.Video:
                if (!string.IsNullOrEmpty(originalQuestion.VideoUrl) && originalQuestion.VideoTimestamp.HasValue)
                {
                    duplicatedQuestion.SetVideoDetails(originalQuestion.VideoUrl, originalQuestion.VideoTimestamp.Value);
                }
                break;

            case QuestionType.Audio:
                if (!string.IsNullOrEmpty(originalQuestion.AudioUrl) && originalQuestion.AudioTimestamp.HasValue)
                {
                    duplicatedQuestion.SetAudioDetails(originalQuestion.AudioUrl, originalQuestion.AudioTimestamp.Value);
                }
                break;
        }

        quizSet.AddQuestion(duplicatedQuestion);
        await _repository.SaveChangesAsync(cancellationToken);

        return duplicatedQuestion.Adapt<QuestionDto>();
    }
}
