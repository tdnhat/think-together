using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Entities;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.ValueObjects;
using Mapster;
using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Enums;
using ThinkTogether.Domain.Exceptions;

namespace ThinkTogether.Application.Handlers.QuizSet.Commands.CreateQuestion;

public sealed class CreateQuestionCommandHandler : IRequestHandler<CreateQuestionCommand, QuestionDto>
{
    private readonly IQuizSetRepository _repository;
    private readonly ICurrentUserService _currentUserService;

    public CreateQuestionCommandHandler(
        IQuizSetRepository repository,
        ICurrentUserService currentUserService)
    {
        _repository = repository;
        _currentUserService = currentUserService;
    }

    public async Task<QuestionDto> Handle(
        CreateQuestionCommand request,
        CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(_currentUserService.UserId!);

        var quizSet = await _repository.GetByIdAsync(request.QuizSetId, cancellationToken);
        if (quizSet == null)
            throw new EntityNotFoundException(nameof(QuizSet), request.QuizSetId);

        if (quizSet.CreatorId != userId)
            throw new UnauthorizedAccessException("Bạn không có quyền thêm câu hỏi vào bộ trắc nghiệm này");

        var question = Question.Create(
            request.QuizSetId,
            request.Content,
            request.Type,
            request.TimeLimit,
            request.DisplayOrder);

        // Set type-specific data
        switch (request.Type)
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
                // Video questions also support options (like multiple choice)
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

            case QuestionType.Audio:
                if (!string.IsNullOrEmpty(request.AudioUrl) && request.AudioTimestamp.HasValue)
                {
                    question.SetAudioDetails(request.AudioUrl, request.AudioTimestamp.Value);
                }
                // Audio questions also support options (like multiple choice)
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
        }

        quizSet.AddQuestion(question);
        await _repository.SaveChangesAsync(cancellationToken);

        return question.Adapt<QuestionDto>();
    }
}

