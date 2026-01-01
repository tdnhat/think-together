using Mapster;
using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Specifications;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Repositories;
using ThinkTogether.Domain.Enums;
using ThinkTogether.Domain.Exceptions;

namespace ThinkTogether.Application.Handlers.Challenge.Queries.GetAttemptDetail;

public sealed class GetAttemptDetailQueryHandler : IRequestHandler<GetAttemptDetailQuery, ChallengeAttemptDto>
{
    private readonly IChallengeRepository _challengeRepository;
    private readonly IQuizSetRepository _quizSetRepository;

    public GetAttemptDetailQueryHandler(
        IChallengeRepository challengeRepository,
        IQuizSetRepository quizSetRepository)
    {
        _challengeRepository = challengeRepository;
        _quizSetRepository = quizSetRepository;
    }

    public async Task<ChallengeAttemptDto> Handle(
        GetAttemptDetailQuery request,
        CancellationToken cancellationToken)
    {
        // Load challenge attempt with answers
        var spec = new ChallengeByAttemptIdSpec(request.AttemptId);
        var challenge = await _challengeRepository.GetBySpecAsync(spec, cancellationToken);
        
        if (challenge == null)
        {
            throw new EntityNotFoundException("Challenge containing attempt", request.AttemptId);
        }

        var attempt = challenge.Attempts.FirstOrDefault(a => a.Id == request.AttemptId);
        if (attempt == null)
        {
            throw new EntityNotFoundException("Lượt chơi", request.AttemptId);
        }

        // Load quiz set and questions
        var quizSet = await _quizSetRepository.GetByIdAsync(challenge.QuizSetId, cancellationToken)
            ?? throw new EntityNotFoundException("Bộ câu hỏi", challenge.QuizSetId);

        var questions = quizSet.Questions
            .Where(q => q.DeletedAt == null)
            .OrderBy(q => q.DisplayOrder)
            .ToList();

        // Map attempt with questions and show correct answers
        var attemptDto = attempt.Adapt<ChallengeAttemptDto>();
        attemptDto.Questions = questions.Select(q =>
        {
            var questionDto = q.Adapt<ChallengeQuestionDto>();

            // Find student's answer for this question
            var studentAnswer = attempt.Answers.FirstOrDefault(a => a.QuestionId == q.Id);

            // Create student answer DTO
            if (studentAnswer != null)
            {
                questionDto.StudentAnswer = new StudentAnswerDto
                {
                    AnswerId = studentAnswer.Id,
                    IsCorrect = studentAnswer.IsCorrect,
                    PointsEarned = studentAnswer.PointsEarned,
                    SubmissionTimeMs = studentAnswer.SubmissionTimeMs,
                    SelectedOptionIndexes = studentAnswer.SelectedOptionIndexes?.ToList(),
                    MatchingPairs = studentAnswer.MatchingPairs?.Select(mp => new AnswerMatchingPairDto
                    {
                        LeftContent = mp.LeftContent,
                        RightContent = mp.RightContent
                    }).ToList(),
                    OrderingItems = studentAnswer.OrderingItems?.Select(oi => new AnswerOrderingItemDto
                    {
                        Content = oi.Content,
                        Position = oi.Position
                    }).ToList()
                };
            }

            // Handle different question types to show correct answers
            // Logic reused from GetHomeworkSubmissionQueryHandler
            switch (q.Type)
            {
                case QuestionType.SingleChoice:
                case QuestionType.TrueFalse:
                case QuestionType.MultipleChoice:
                    if (questionDto.Options != null)
                    {
                        foreach (var option in questionDto.Options)
                        {
                            var srcOption = q.Options.FirstOrDefault(o => o.DisplayOrder == option.DisplayOrder);
                            if (srcOption != null)
                            {
                                option.IsCorrect = srcOption.IsCorrect;
                            }
                        }
                    }
                    break;

                case QuestionType.Ordering:
                    if (questionDto.OrderingItems != null)
                    {
                        foreach (var item in questionDto.OrderingItems)
                        {
                            var srcItem = q.OrderingItems.FirstOrDefault(i => i.Content == item.Content);
                            if (srcItem != null)
                            {
                                item.CorrectPosition = srcItem.CorrectPosition;
                            }
                        }
                    }
                    break;
            }

            return questionDto;
        }).ToList();

        return attemptDto;
    }
}
