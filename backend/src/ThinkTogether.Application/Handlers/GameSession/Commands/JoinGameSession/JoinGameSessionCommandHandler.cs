using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Entities;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Specifications;
using ThinkTogether.Domain.Enums;
using ThinkTogether.Domain.Exceptions;
using ThinkTogether.Shared.Common;

namespace ThinkTogether.Application.Handlers.GameSession.Commands.JoinGameSession;

public sealed class JoinGameSessionCommandHandler : IRequestHandler<JoinGameSessionCommand, GamePlayerDto>
{
    private readonly IGameSessionRepository _gameSessionRepository;
    private readonly IUnitOfWork _unitOfWork;

    public JoinGameSessionCommandHandler(
        IGameSessionRepository gameSessionRepository,
        IUnitOfWork unitOfWork)
    {
        _gameSessionRepository = gameSessionRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<GamePlayerDto> Handle(JoinGameSessionCommand request, CancellationToken cancellationToken)
    {
        var spec = new GameSessionByPinSpec(request.Pin);
        var gameSession = await _gameSessionRepository.GetBySpecAsync(spec, cancellationToken)
            ?? throw new EntityNotFoundException("Phiên trò chơi", request.Pin);

        if (gameSession.Status != GameStatus.Waiting)
            throw new ConflictException("Không thể tham gia phiên trò chơi đã bắt đầu");

        // Check if player already exists by nickname (idempotency)
        var existingPlayer = gameSession.Players.FirstOrDefault(p => p.Nickname.Equals(request.Nickname, StringComparison.OrdinalIgnoreCase));
        if (existingPlayer != null)
        {
            // If player exists, just update connection status and return existing player
            // This handles the "duplicate player" issue where rapid reconnects or double-joins might create multiple players
            
            // Note: In a real scenario, we might want to check authentication or connection tokens here
            // to prevent nickname sniping, but for now we assume nickname ownership by session.
            // Since we're just returning the existing player ID, the client will use that to connect.
            
            return new GamePlayerDto
            {
                Id = existingPlayer.Id,
                Nickname = existingPlayer.Nickname,
                ConnectionStatus = existingPlayer.ConnectionStatus,
                TotalPoints = 0,
                Rank = null
            };
        }

        var player = GamePlayer.Create(gameSession.Id, request.Nickname);
        gameSession.AddPlayer(player);

        await _gameSessionRepository.UpdateAsync(gameSession, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new GamePlayerDto
        {
            Id = player.Id,
            Nickname = player.Nickname,
            ConnectionStatus = player.ConnectionStatus,
            TotalPoints = 0,
            Rank = null
        };
    }
}
