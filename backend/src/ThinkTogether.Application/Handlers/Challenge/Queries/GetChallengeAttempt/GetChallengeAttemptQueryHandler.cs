using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Specifications;
using ThinkTogether.Domain.Exceptions;

namespace ThinkTogether.Application.Handlers.Challenge.Queries.GetChallengeAttempt;

public sealed class GetChallengeAttemptQueryHandler : IRequestHandler<GetChallengeAttemptQuery, ChallengeAttemptDto>
{
    private readonly IChallengeRepository _challengeRepository;
    private readonly IQuizSetRepository _quizSetRepository;

    public GetChallengeAttemptQueryHandler(
        IChallengeRepository challengeRepository,
        IQuizSetRepository quizSetRepository)
    {
        _challengeRepository = challengeRepository;
        _quizSetRepository = quizSetRepository;
    }

    public async Task<ChallengeAttemptDto> Handle(GetChallengeAttemptQuery request, CancellationToken cancellationToken)
    {
        var spec = new ChallengeByAttemptIdSpec(request.AttemptId);
        var challenge = await _challengeRepository.GetBySpecAsync(spec, cancellationToken)
            ?? throw new EntityNotFoundException("Thử thách", request.AttemptId);

        var attempt = challenge.Attempts.FirstOrDefault(a => a.Id == request.AttemptId)
            ?? throw new EntityNotFoundException("Lượt chơi", request.AttemptId);

        var quizSet = await _quizSetRepository.GetByIdAsync(challenge.QuizSetId, cancellationToken)
            ?? throw new EntityNotFoundException("Bộ câu hỏi", challenge.QuizSetId);

        var questions = quizSet.Questions
            .Where(q => q.DeletedAt == null)
            .OrderBy(q => q.DisplayOrder)
            .ToList();

        return MapToDto(attempt, questions, challenge);
    }

    private static ChallengeAttemptDto MapToDto(
        Domain.Aggregates.ChallengeAggregate.Entities.ChallengeAttempt attempt,
        List<Domain.Aggregates.QuizSetAggregate.Entities.Question> questions,
        Domain.Aggregates.ChallengeAggregate.Challenge challenge)
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
                    IsCorrect = attempt.Status == Domain.Enums.AttemptStatus.Completed ? o.IsCorrect : false,
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
                    CorrectPosition = attempt.Status == Domain.Enums.AttemptStatus.Completed ? i.CorrectPosition : 0
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
            TimeLimitMs = attempt.TimeLimitMs,
            RemainingTimeMs = attempt.GetRemainingTimeMs(),
            Questions = questionDtos,
            FlaggedQuestionIds = flaggedQuestionIds
        };
    }
}
