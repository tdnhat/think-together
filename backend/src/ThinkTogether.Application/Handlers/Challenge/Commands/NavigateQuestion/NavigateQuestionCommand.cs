using MediatR;

namespace ThinkTogether.Application.Handlers.Challenge.Commands.NavigateQuestion;

public sealed record NavigateQuestionCommand(
    Guid AttemptId,
    int QuestionIndex) : IRequest<Unit>;
