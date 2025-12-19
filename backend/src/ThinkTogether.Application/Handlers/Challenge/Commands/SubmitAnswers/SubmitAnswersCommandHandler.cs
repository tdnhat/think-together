using MediatR;
using Microsoft.Extensions.Logging;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Entities;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Specifications;
using ThinkTogether.Domain.Aggregates.ClassAggregate.Entities;
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
    private readonly IClassRepository _classRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<SubmitAnswersCommandHandler> _logger;

    public SubmitAnswersCommandHandler(
        IChallengeRepository challengeRepository,
        IQuizSetRepository quizSetRepository,
        IClassRepository classRepository,
        IUnitOfWork unitOfWork,
        ILogger<SubmitAnswersCommandHandler> logger)
    {
        _challengeRepository = challengeRepository;
        _quizSetRepository = quizSetRepository;
        _classRepository = classRepository;
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

            // Grade the answer immediately
            var (isCorrect, pointsEarned) = GradeAnswer(question, answerSubmission, matchingPairs, orderingItems);

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

        // If this is a homework submission, create HomeworkSubmission record
        if (request.HomeworkId.HasValue && attempt.UserId.HasValue)
        {
            var result = await _classRepository.GetClassAndHomeworkByHomeworkIdAsync(request.HomeworkId.Value, cancellationToken);
            
            if (result.HasValue)
            {
                var (homeworkClass, homework) = result.Value;
                
                var submission = HomeworkSubmission.Create(
                    homeworkId: homework.Id,
                    studentId: attempt.UserId.Value,
                    challengeAttemptId: attempt.Id,
                    score: totalScore,
                    dueDate: homework.DueDate);

                homework.AddSubmission(submission);
                await _classRepository.UpdateAsync(homeworkClass, cancellationToken);

                _logger.LogInformation(
                    "Created homework submission for homework {HomeworkId}, attempt {AttemptId}, score {Score}",
                    homework.Id, attempt.Id, totalScore);
            }
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Completed grading for attempt {AttemptId}: Score={Score}, Correct={Correct}/{Total}", 
            request.AttemptId, totalScore, correctAnswers, attempt.TotalQuestions);

        // Return the completed attempt
        return MapToDto(attempt, quizSet);
    }

    private static (bool IsCorrect, int PointsEarned) GradeAnswer(
        Domain.Aggregates.QuizSetAggregate.Entities.Question question,
        AnswerSubmissionDto answerSubmission,
        List<AnswerMatchingPair>? matchingPairs,
        List<AnswerOrderingItem>? orderingItems)
    {
        var isCorrect = false;

        switch (question.Type)
        {
            case QuestionType.SingleChoice:
            case QuestionType.MultipleChoice:
            case QuestionType.TrueFalse:
                if (answerSubmission.SelectedOptionIndexes == null || !answerSubmission.SelectedOptionIndexes.Any())
                {
                    isCorrect = false;
                }
                else
                {
                    var correctIndexes = question.Options
                        .Select((o, index) => new { Option = o, Index = index })
                        .Where(x => x.Option.IsCorrect)
                        .Select(x => x.Index)
                        .ToList();

                    isCorrect = answerSubmission.SelectedOptionIndexes.Count == correctIndexes.Count &&
                               answerSubmission.SelectedOptionIndexes.All(i => correctIndexes.Contains(i));
                }
                break;

            case QuestionType.Matching:
                if (matchingPairs == null || !matchingPairs.Any())
                {
                    isCorrect = false;
                }
                else
                {
                    var correctPairs = question.MatchingPairs.OrderBy(p => p.DisplayOrder).ToList();
                    isCorrect = correctPairs.Count == matchingPairs.Count &&
                               correctPairs.All(cp =>
                                   matchingPairs.Any(sp =>
                                       sp.LeftContent == cp.LeftContent &&
                                       sp.RightContent == cp.RightContent));
                }
                break;

            case QuestionType.Ordering:
                if (orderingItems == null || !orderingItems.Any())
                {
                    isCorrect = false;
                }
                else
                {
                    var correctOrder = question.OrderingItems
                        .OrderBy(i => i.CorrectPosition)
                        .Select(i => i.Content)
                        .ToList();

                    var submittedOrder = orderingItems
                        .OrderBy(i => i.Position)
                        .Select(i => i.Content)
                        .ToList();

                    isCorrect = correctOrder.SequenceEqual(submittedOrder);
                }
                break;
        }

        var pointsEarned = isCorrect ? 10 : 0;
        return (isCorrect, pointsEarned);
    }

    private static ChallengeAttemptDto MapToDto(
        ChallengeAttempt attempt,
        Domain.Aggregates.QuizSetAggregate.QuizSet quizSet)
    {
        var questionDtos = quizSet.Questions.OrderBy(q => q.DisplayOrder).Select(q =>
        {
            var answer = attempt.Answers.FirstOrDefault(a => a.QuestionId == q.Id);

            return new ChallengeQuestionDto
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
                Options = q.Options.OrderBy(o => o.DisplayOrder).Select(o => new QuestionOptionDto
                {
                    Content = o.Content,
                    IsCorrect = answer != null, // Only show correct answers after completion
                    DisplayOrder = o.DisplayOrder,
                    ImageUrl = o.ImageUrl
                }).ToList(),
                MatchingPairs = q.MatchingPairs.OrderBy(p => p.DisplayOrder).Select(p => new MatchingPairDto
                {
                    LeftContent = p.LeftContent,
                    RightContent = p.RightContent,
                    DisplayOrder = p.DisplayOrder
                }).ToList(),
                OrderingItems = q.OrderingItems.OrderBy(i => i.CorrectPosition).Select(i => new OrderingItemDto
                {
                    Content = i.Content,
                    CorrectPosition = i.CorrectPosition
                }).ToList()
            };
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
