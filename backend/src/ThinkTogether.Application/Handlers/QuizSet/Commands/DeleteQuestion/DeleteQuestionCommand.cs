using MediatR;

namespace ThinkTogether.Application.Handlers.QuizSet.Commands.DeleteQuestion;

public sealed record DeleteQuestionCommand(
    Guid QuizSetId,
    Guid QuestionId) : IRequest;

