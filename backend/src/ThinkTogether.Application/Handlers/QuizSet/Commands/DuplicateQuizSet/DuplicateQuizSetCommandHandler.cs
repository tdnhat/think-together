using Mapster;
using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Entities;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.ValueObjects;
using ThinkTogether.Domain.Aggregates.UserAggregate.Repositories;
using ThinkTogether.Domain.Enums;
using ThinkTogether.Domain.Exceptions;

namespace ThinkTogether.Application.Handlers.QuizSet.Commands.DuplicateQuizSet;

public sealed class DuplicateQuizSetCommandHandler : IRequestHandler<DuplicateQuizSetCommand, QuizSetDto>
{
    private readonly IQuizSetRepository _repository;
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;

    public DuplicateQuizSetCommandHandler(
        IQuizSetRepository repository,
        IUserRepository userRepository,
        ICurrentUserService currentUserService)
    {
        _repository = repository;
        _userRepository = userRepository;
        _currentUserService = currentUserService;
    }

    public async Task<QuizSetDto> Handle(
        DuplicateQuizSetCommand request,
        CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(_currentUserService.UserId!);

        var originalQuizSet = await _repository.GetByIdAsync(request.QuizSetId, cancellationToken);
        if (originalQuizSet == null)
            throw new EntityNotFoundException(nameof(QuizSet), request.QuizSetId);

        if (originalQuizSet.CreatorId != userId)
            throw new ForbiddenException("Bạn chỉ có thể sao chép bộ câu hỏi của mình");

        var duplicatedQuizSet = Domain.Aggregates.QuizSetAggregate.QuizSet.Create(
            userId,
            $"{originalQuizSet.Title} - Bản sao",
            originalQuizSet.Description);

        if (!string.IsNullOrEmpty(originalQuizSet.CoverImageUrl))
        {
            duplicatedQuizSet.UpdateCoverImageUrl(originalQuizSet.CoverImageUrl);
        }

        foreach (var originalQuestion in originalQuizSet.Questions)
        {
            var duplicatedQuestion = Question.Create(
                duplicatedQuizSet.Id,
                originalQuestion.Content,
                originalQuestion.Type,
                originalQuestion.TimeLimit,
                originalQuestion.DisplayOrder);

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
            }

            duplicatedQuizSet.AddQuestion(duplicatedQuestion);
        }

        await _repository.AddAsync(duplicatedQuizSet, cancellationToken);
        await _repository.SaveChangesAsync(cancellationToken);

        var creator = await _userRepository.GetByIdAsync(userId, cancellationToken);

        var dto = duplicatedQuizSet.Adapt<QuizSetDto>();
        dto.CreatorName = creator != null ? $"{creator.FirstName} {creator.LastName}".Trim() : "Unknown Creator";

        return dto;
    }
}
