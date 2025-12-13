using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.Challenge.Commands.SubmitAnswer;

public sealed record SubmitAnswerCommand(
    Guid AttemptId,
    Guid QuestionId,
    List<int>? SelectedOptionIndexes = null,
    List<AnswerMatchingPairDto>? MatchingPairs = null,
    List<AnswerOrderingItemDto>? OrderingItems = null) : IRequest<ChallengeAnswerDto>;
