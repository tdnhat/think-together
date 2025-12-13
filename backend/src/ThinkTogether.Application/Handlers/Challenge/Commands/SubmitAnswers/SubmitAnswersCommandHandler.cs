using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Entities;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Specifications;
using ThinkTogether.Domain.Enums;
using ThinkTogether.Domain.Exceptions;
using ThinkTogether.Shared.Common;

namespace ThinkTogether.Application.Handlers.Challenge.Commands.SubmitAnswers;

public sealed class SubmitAnswersCommandHandler : IRequestHandler<SubmitAnswersCommand, ChallengeAttemptDto>
{
    private readonly IChallengeRepository _challengeRepository;
    private readonly IQuizSetRepository _quizSetRepository;
    private readonly IUnitOfWork _unitOfWork;

    public SubmitAnswersCommandHandler(
        IChallengeRepository challengeRepository,
        IQuizSetRepository quizSetRepository,
        IUnitOfWork unitOfWork)
    {
        _challengeRepository = challengeRepository;
        _quizSetRepository = quizSetRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<ChallengeAttemptDto> Handle(SubmitAnswersCommand request, CancellationToken cancellationToken)
    {
        var spec = new ChallengeByAttemptIdSpec(request.AttemptId);
        var challenge = await _challengeRepository.GetBySpecAsync(spec, cancellationToken)
            ?? throw new EntityNotFoundException("Thử thách", request.AttemptId);

        var attempt = challenge.Attempts.FirstOrDefault(a => a.Id == request.AttemptId)
            ?? throw new EntityNotFoundException("Lượt chơi", request.AttemptId);

        if (attempt.Status != AttemptStatus.InProgress)
            throw new ConflictException("Lượt chơi không còn trong trạng thái đang làm");

        var quizSet = await _quizSetRepository.GetByIdAsync(challenge.QuizSetId, cancellationToken)
            ?? throw new EntityNotFoundException("Bộ câu hỏi", challenge.QuizSetId);

        // Process each answer
        foreach (var answerSubmission in request.Answers)
        {
            var question = quizSet.Questions.FirstOrDefault(q => q.Id == answerSubmission.QuestionId)
                ?? throw new EntityNotFoundException("Câu hỏi", answerSubmission.QuestionId);

            // Calculate elapsed time since attempt started
            var elapsedMs = (int)(DateTime.UtcNow - attempt.StartedAt).TotalMilliseconds;

            // Validate and check answer based on question type
            bool isCorrect = false;
            int pointsEarned = 0;

            switch (question.Type)
            {
                case QuestionType.SingleChoice:
                case QuestionType.MultipleChoice:
                case QuestionType.TrueFalse:
                    if (answerSubmission.SelectedOptionIndexes == null || !answerSubmission.SelectedOptionIndexes.Any())
                    {
                        // Empty answer is treated as incorrect
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
                    if (answerSubmission.MatchingPairs == null || !answerSubmission.MatchingPairs.Any())
                    {
                        isCorrect = false;
                    }
                    else
                    {
                        // Compare matching pairs
                        var correctPairs = question.MatchingPairs.OrderBy(p => p.DisplayOrder).ToList();
                        var submittedPairs = answerSubmission.MatchingPairs.OrderBy(p => p.LeftContent).ToList();

                        if (correctPairs.Count != submittedPairs.Count)
                        {
                            isCorrect = false;
                        }
                        else
                        {
                            isCorrect = correctPairs.All(cp =>
                                submittedPairs.Any(sp =>
                                    sp.LeftContent == cp.LeftContent &&
                                    sp.RightContent == cp.RightContent));
                        }
                    }
                    break;

                case QuestionType.Ordering:
                    if (answerSubmission.OrderingItems == null || !answerSubmission.OrderingItems.Any())
                    {
                        isCorrect = false;
                    }
                    else
                    {
                        var correctOrder = question.OrderingItems
                            .OrderBy(i => i.CorrectPosition)
                            .Select(i => i.Content)
                            .ToList();

                        var submittedOrder = answerSubmission.OrderingItems
                            .OrderBy(i => i.Position)
                            .Select(i => i.Content)
                            .ToList();

                        isCorrect = correctOrder.SequenceEqual(submittedOrder);
                    }
                    break;

                default:
                    throw new ValidationException("Loại câu hỏi không được hỗ trợ");
            }

            // Calculate points (simple: 10 points per correct answer, 0 for wrong)
            pointsEarned = isCorrect ? 10 : 0;

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

        await _challengeRepository.UpdateAsync(challenge, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // Get questions for mapping
        var questions = quizSet.Questions
            .Where(q => q.DeletedAt == null)
            .OrderBy(q => q.DisplayOrder)
            .ToList();

        // Return updated attempt with all answers
        return MapToDto(attempt, questions);
    }

    private static ChallengeAttemptDto MapToDto(
        ChallengeAttempt attempt,
        List<Domain.Aggregates.QuizSetAggregate.Entities.Question> questions)
    {
        var flaggedQuestionIds = attempt.FlaggedQuestions.Select(fq => fq.QuestionId).ToList();
        var answersByQuestionId = attempt.Answers.ToDictionary(a => a.QuestionId);

        var questionDtos = questions.Select(q =>
        {
            var answer = answersByQuestionId.GetValueOrDefault(q.Id);
            var isFlagged = flaggedQuestionIds.Contains(q.Id);

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
                Options = q.Options.Select(o => new QuestionOptionDto
                {
                    Content = o.Content,
                    IsCorrect = o.IsCorrect,
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
                    CorrectPosition = i.CorrectPosition
                }).ToList(),
                IsFlagged = isFlagged,
                IsAnswered = answer != null,
                Answer = answer != null ? new ChallengeAnswerDto
                {
                    Id = answer.Id,
                    QuestionId = answer.QuestionId,
                    SubmissionTimeMs = answer.SubmissionTimeMs,
                    IsCorrect = answer.IsCorrect,
                    PointsEarned = answer.PointsEarned,
                    SelectedOptionIndexes = answer.SelectedOptionIndexes.ToList(),
                    MatchingPairs = answer.MatchingPairs.Select(p => new AnswerMatchingPairDto
                    {
                        LeftContent = p.LeftContent,
                        RightContent = p.RightContent
                    }).ToList(),
                    OrderingItems = answer.OrderingItems.Select(i => new AnswerOrderingItemDto
                    {
                        Content = i.Content,
                        Position = i.Position
                    }).ToList()
                } : null
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
            CurrentQuestionIndex = attempt.CurrentQuestionIndex,
            Status = attempt.Status,
            Questions = questionDtos
        };
    }
}

