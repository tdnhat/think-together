using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.Challenge.Commands.SubmitAnswers;

public sealed record SubmitAnswersCommand(
    Guid AttemptId,
    List<AnswerSubmissionDto> Answers,
    Guid? HomeworkId = null) : IRequest<ChallengeAttemptDto>;

public sealed record AnswerSubmissionDto(
    Guid QuestionId,
    List<int>? SelectedOptionIndexes = null,
    List<AnswerMatchingPairDto>? MatchingPairs = null,
    List<AnswerOrderingItemDto>? OrderingItems = null);
