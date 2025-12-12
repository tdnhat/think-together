using MediatR;
using Microsoft.Extensions.Logging;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Specifications;
using ThinkTogether.Domain.Exceptions;
using ThinkTogether.Shared.Common;

namespace ThinkTogether.Application.Handlers.GameSession.Commands.AbandonActiveSession;

public sealed class AbandonActiveSessionCommandHandler : IRequestHandler<AbandonActiveSessionCommand, bool>
{
    private readonly IGameSessionRepository _gameSessionRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<AbandonActiveSessionCommandHandler> _logger;

    public AbandonActiveSessionCommandHandler(
        IGameSessionRepository gameSessionRepository,
        ICurrentUserService currentUserService,
        IUnitOfWork unitOfWork,
        ILogger<AbandonActiveSessionCommandHandler> logger)
    {
        _gameSessionRepository = gameSessionRepository;
        _currentUserService = currentUserService;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<bool> Handle(AbandonActiveSessionCommand request, CancellationToken cancellationToken)
    {
        var hostUserId = GetCurrentHostUserId();

        var spec = new ActiveGameSessionByHostSpec(hostUserId);
        var activeSession = await _gameSessionRepository.GetBySpecAsync(spec, cancellationToken);

        if (activeSession == null)
            return false;

        _logger.LogInformation("Abandoning game session {SessionId} for user {UserId}", activeSession.Id, hostUserId);

        activeSession.End();

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return true;
    }

    private Guid GetCurrentHostUserId()
    {
        var userIdString = _currentUserService.UserId
            ?? throw new UnauthorizedException("Người dùng chưa đăng nhập");

        if (!Guid.TryParse(userIdString, out var hostUserId))
            throw new UnauthorizedException("ID người dùng không hợp lệ");

        return hostUserId;
    }
}
