using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.GameSession.Commands.SubmitAnswer;

public sealed record SubmitAnswerCommand(
    Guid GameSessionId,
    Guid PlayerId,
    Guid GameQuestionId,
    List<int> SelectedOptionIndexes,
    int ResponseTimeMs) : IRequest<AnswerResultDto>;

