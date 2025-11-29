using MediatR;

namespace ThinkTogether.Application.Handlers.QuizSet.Commands.DeleteQuizSet;

public sealed record DeleteQuizSetCommand(Guid Id) : IRequest;
