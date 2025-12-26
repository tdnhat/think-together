using MediatR;
using Microsoft.Extensions.Logging;
using ThinkTogether.Application.Common;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Specifications;
using ThinkTogether.Domain.Exceptions;
using ThinkTogether.Shared.Common;

namespace ThinkTogether.Application.Handlers.GameSession.Commands.AbandonActiveSession;

public sealed class AbandonActiveSessionCommandHandler : BaseHandler, IRequestHandler<AbandonActiveSessionCommand, bool>
{
    private readonly IGameSessionRepository _gameSessionRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<AbandonActiveSessionCommandHandler> _logger;

    public AbandonActiveSessionCommandHandler(
        IGameSessionRepository gameSessionRepository,
        ICurrentUserService currentUserService,
        IUnitOfWork unitOfWork,
        ILogger<AbandonActiveSessionCommandHandler> logger)
        : base(currentUserService)
    {
        _gameSessionRepository = gameSessionRepository;
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
}
