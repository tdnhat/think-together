using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Entities;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Repositories;
using ThinkTogether.Domain.Enums;
using ThinkTogether.Domain.Exceptions;
using ThinkTogether.Shared.Common;

namespace ThinkTogether.Application.Handlers.Challenge.Commands.StartChallengeAttempt;

public sealed class StartChallengeAttemptCommandHandler : IRequestHandler<StartChallengeAttemptCommand, ChallengeAttemptDto>
{
    private readonly IChallengeRepository _challengeRepository;
    private readonly IQuizSetRepository _quizSetRepository;
    private readonly IUnitOfWork _unitOfWork;

    public StartChallengeAttemptCommandHandler(
        IChallengeRepository challengeRepository,
        IQuizSetRepository quizSetRepository,
        IUnitOfWork unitOfWork)
    {
        _challengeRepository = challengeRepository;
        _quizSetRepository = quizSetRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<ChallengeAttemptDto> Handle(StartChallengeAttemptCommand request, CancellationToken cancellationToken)
    {
        var challenge = await _challengeRepository.GetByIdAsync(request.ChallengeId, cancellationToken)
            ?? throw new EntityNotFoundException("Thử thách", request.ChallengeId);

        if (challenge.Status != ChallengeStatus.Active)
            throw new ConflictException("Thử thách không còn hoạt động");

        var quizSet = await _quizSetRepository.GetByIdAsync(challenge.QuizSetId, cancellationToken)
            ?? throw new EntityNotFoundException("Bộ câu hỏi", challenge.QuizSetId);

        var questions = quizSet.Questions
            .Where(q => q.DeletedAt == null)
            .OrderBy(q => q.DisplayOrder)
            .ToList();

        if (questions.Count == 0)
            throw new ValidationException("Bộ câu hỏi không có câu hỏi nào");

        // Calculate total time limit (sum of all question time limits, or null if unlimited)
        int? totalTimeLimitMs = null;
        // For now, we'll leave it as null (unlimited time per challenge)
        // If needed, can be calculated: totalTimeLimitMs = questions.Sum(q => q.TimeLimit) * 1000;

        // Use user's name as nickname if UserId is provided and nickname is empty
        var nickname = request.Nickname;
        if (request.UserId.HasValue && string.IsNullOrWhiteSpace(nickname))
        {
            // This will be handled by the caller (frontend) to provide user's name
            // But as fallback, we can use a default
            nickname = "Học sinh";
        }

        var attempt = ChallengeAttempt.Create(
            challenge.Id,
            request.UserId,
            nickname,
            questions.Count,
            totalTimeLimitMs);

        challenge.AddAttempt(attempt);

        await _challengeRepository.UpdateAsync(challenge, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return MapToDto(attempt, questions, challenge);
    }

    private static ChallengeAttemptDto MapToDto(
        ChallengeAttempt attempt,
        List<Domain.Aggregates.QuizSetAggregate.Entities.Question> questions,
        Domain.Aggregates.ChallengeAggregate.Challenge challenge)
    {
        var questionDtos = questions.Select((q, index) => new ChallengeQuestionDto
        {
            Id = q.Id,
            QuizSetId = q.QuizSetId,
            Content = q.Content,
            Type = q.Type,
            TimeLimit = q.TimeLimit,
            DisplayOrder = q.DisplayOrder,
            VideoUrl = q.VideoUrl,
            VideoTimestamp = q.VideoTimestamp,
            AudioUrl = q.AudioUrl,
            AudioTimestamp = q.AudioTimestamp,
            Options = q.Options.Select(o => new QuestionOptionDto
            {
                Content = o.Content,
                IsCorrect = false, // Don't show correct answers during attempt
                DisplayOrder = o.DisplayOrder,
                ImageUrl = o.ImageUrl
            }).ToList(),
            MatchingPairs = q.MatchingPairs.Select(p => new MatchingPairDto
            {
                LeftContent = p.LeftContent,
                RightContent = p.RightContent,
                DisplayOrder = p.DisplayOrder
            }).ToList(),
            OrderingItems = q.OrderingItems.Select(i => new OrderingItemDto
            {
                Content = i.Content,
                CorrectPosition = 0 // Don't show correct position during attempt
            }).ToList()
        }).ToList();

        return new ChallengeAttemptDto
        {
            Id = attempt.Id,
            ChallengeId = attempt.ChallengeId,
            UserId = attempt.UserId,
            Nickname = attempt.Nickname,
            ScoreAchieved = attempt.ScoreAchieved,
            CorrectAnswers = attempt.CorrectAnswers,
            TotalQuestions = attempt.TotalQuestions,
            CompletionTimeMs = attempt.CompletionTimeMs,
            CompletedAt = attempt.CompletedAt,
            StartedAt = attempt.StartedAt,
            Status = attempt.Status,
            TimeLimitMs = attempt.TimeLimitMs,
            RemainingTimeMs = attempt.GetRemainingTimeMs(),
            Questions = questionDtos
        };
    }
}
