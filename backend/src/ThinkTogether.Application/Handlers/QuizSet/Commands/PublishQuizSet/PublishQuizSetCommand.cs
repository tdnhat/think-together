using MediatR;

namespace ThinkTogether.Application.Handlers.QuizSet.Commands.PublishQuizSet;

public sealed record PublishQuizSetCommand(Guid Id) : IRequest;
