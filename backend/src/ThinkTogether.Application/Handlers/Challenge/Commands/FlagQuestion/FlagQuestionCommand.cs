using MediatR;

namespace ThinkTogether.Application.Handlers.Challenge.Commands.FlagQuestion;

public sealed record FlagQuestionCommand(
    Guid AttemptId,
    Guid QuestionId,
    bool IsFlagged) : IRequest<Unit>;
