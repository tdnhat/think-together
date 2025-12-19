using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Specifications;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Repositories;
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
        var questionDtos = questions.Select(q =>
        {
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
                    IsCorrect = false,
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
                    CorrectPosition = 0
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
