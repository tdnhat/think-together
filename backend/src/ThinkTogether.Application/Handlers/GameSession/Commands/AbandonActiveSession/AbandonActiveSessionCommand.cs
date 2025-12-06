using MediatR;

namespace ThinkTogether.Application.Handlers.GameSession.Commands.AbandonActiveSession;

public sealed record AbandonActiveSessionCommand : IRequest<bool>;
