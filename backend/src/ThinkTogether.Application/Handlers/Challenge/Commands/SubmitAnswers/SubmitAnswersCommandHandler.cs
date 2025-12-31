using Mapster;
using MediatR;
using Microsoft.Extensions.Logging;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Entities;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Services;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Specifications;
using ThinkTogether.Domain.Aggregates.ClassAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Repositories;
using ThinkTogether.Domain.Enums;
using ThinkTogether.Domain.Exceptions;
using ThinkTogether.Shared.Common;

namespace ThinkTogether.Application.Handlers.Challenge.Commands.SubmitAnswers;

public sealed class SubmitAnswersCommandHandler : IRequestHandler<SubmitAnswersCommand, ChallengeAttemptDto>
{
    private readonly IChallengeRepository _challengeRepository;
    private readonly IQuizSetRepository _quizSetRepository;
    private readonly IAnswerGradingService _gradingService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<SubmitAnswersCommandHandler> _logger;

    public SubmitAnswersCommandHandler(
        IChallengeRepository challengeRepository,
        IQuizSetRepository quizSetRepository,
        IAnswerGradingService gradingService,
        IUnitOfWork unitOfWork,
        ILogger<SubmitAnswersCommandHandler> logger)
    {
        _challengeRepository = challengeRepository;
        _quizSetRepository = quizSetRepository;
        _gradingService = gradingService;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<ChallengeAttemptDto> Handle(SubmitAnswersCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Processing answer submission for attempt {AttemptId}", request.AttemptId);

        var spec = new ChallengeByAttemptIdSpec(request.AttemptId);
        var challenge = await _challengeRepository.GetBySpecAsync(spec, cancellationToken)
            ?? throw new EntityNotFoundException("Thử thách", request.AttemptId);

        var attempt = challenge.Attempts.FirstOrDefault(a => a.Id == request.AttemptId)
            ?? throw new EntityNotFoundException("Lượt chơi", request.AttemptId);

        if (attempt.Status != AttemptStatus.InProgress)
            throw new ConflictException("Lượt chơi không còn trong trạng thái đang làm");

        var quizSet = await _quizSetRepository.GetByIdAsync(challenge.QuizSetId, cancellationToken)
            ?? throw new EntityNotFoundException("Bộ câu hỏi", challenge.QuizSetId);

        // Process and grade each answer
        foreach (var answerSubmission in request.Answers)
        {
            var question = quizSet.Questions.FirstOrDefault(q => q.Id == answerSubmission.QuestionId)
                ?? throw new EntityNotFoundException("Câu hỏi", answerSubmission.QuestionId);

            // Calculate elapsed time since attempt started
            var elapsedMs = (int)(DateTime.UtcNow - attempt.StartedAt).TotalMilliseconds;

            // Convert DTOs to domain entities
            List<AnswerMatchingPair>? matchingPairs = null;
            if (answerSubmission.MatchingPairs != null)
            {
                matchingPairs = answerSubmission.MatchingPairs.Select(p => new AnswerMatchingPair
                {
                    LeftContent = p.LeftContent,
                    RightContent = p.RightContent
                }).ToList();
            }

            List<AnswerOrderingItem>? orderingItems = null;
            if (answerSubmission.OrderingItems != null)
            {
                orderingItems = answerSubmission.OrderingItems.Select(i => new AnswerOrderingItem
                {
                    Content = i.Content,
                    Position = i.Position
                }).ToList();
            }

            // Grade the answer using domain service
            var (isCorrect, pointsEarned) = _gradingService.GradeAnswer(
                question,
                answerSubmission.SelectedOptionIndexes,
                matchingPairs,
                orderingItems);

            var answer = ChallengeAnswer.Create(
                attempt.Id,
                question.Id,
                elapsedMs,
                isCorrect,
                pointsEarned,
                answerSubmission.SelectedOptionIndexes,
                matchingPairs,
                orderingItems);

            attempt.UpdateAnswer(answer);
        }

        // Calculate final results
        var totalScore = attempt.Answers.Sum(a => a.PointsEarned);
        var correctAnswers = attempt.Answers.Count(a => a.IsCorrect);
        var completionTimeMs = (int)(DateTime.UtcNow - attempt.StartedAt).TotalMilliseconds;
        
        // Mark as completed
        attempt.Complete(totalScore, correctAnswers, completionTimeMs);

        await _challengeRepository.UpdateAsync(challenge, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Completed grading for attempt {AttemptId}: Score={Score}, Correct={Correct}/{Total}", 
            request.AttemptId, totalScore, correctAnswers, attempt.TotalQuestions);

        // Return the completed attempt with correct answers shown
        var attemptDto = attempt.Adapt<ChallengeAttemptDto>();
        var questions = quizSet.Questions
            .Where(q => q.DeletedAt == null)
            .OrderBy(q => q.DisplayOrder)
            .ToList();
        
        // Map questions and show correct answers for completed attempts
        attemptDto.Questions = questions.Select(q =>
        {
            var dto = q.Adapt<ChallengeQuestionDto>();
            // Show correct answers after completion
            if (dto.Options != null)
            {
                foreach (var option in dto.Options)
                {
                    var srcOption = q.Options.FirstOrDefault(o => o.Content == option.Content && o.DisplayOrder == option.DisplayOrder);
                    if (srcOption != null)
                    {
                        option.IsCorrect = srcOption.IsCorrect;
                    }
                }
            }
            // Show correct ordering positions
            if (dto.OrderingItems != null)
            {
                foreach (var item in dto.OrderingItems)
                {
                    var srcItem = q.OrderingItems.FirstOrDefault(i => i.Content == item.Content);
                    if (srcItem != null)
                    {
                        item.CorrectPosition = srcItem.CorrectPosition;
                    }
                }
            }
            return dto;
        }).ToList();
        
        return attemptDto;
    }
}
