using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.GameSession.Commands.JoinGameSession;

/// <summary>
/// Command to join a game session.
/// Nickname is required for anonymous users.
/// UserId is optional for authenticated users (nickname will be fetched from user profile).
/// </summary>
public sealed record JoinGameSessionCommand(
    string Pin,
    string Nickname,
    Guid? UserId = null
) : IRequest<GamePlayerDto>;
