using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Handlers.GameSession.Queries.GetGameSession;
using ThinkTogether.Application.Handlers.GameSession.Queries.GetGameSessionByPin;
using ThinkTogether.Application.Handlers.GameSession.Queries.GetLeaderboard;
using ThinkTogether.Application.Handlers.GameSession.Queries.SyncGameSession;

namespace ThinkTogether.Api.Controllers.Gaming;

public partial class GameSessionController
{
    [HttpGet("{id:guid}")]
    [Authorize]
    [ProducesResponseType(typeof(GameSessionDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetGameSession(Guid id, CancellationToken cancellationToken)
    {
        var query = new GetGameSessionQuery(id);
        var result = await _mediator.Send(query, cancellationToken);

        return Ok(result
        );
    }

    [HttpGet("by-pin/{pin}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(GameSessionDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetGameSessionByPin(string pin, CancellationToken cancellationToken)
    {
        var query = new GetGameSessionByPinQuery(pin);
        var result = await _mediator.Send(query, cancellationToken);

        return Ok(result
        );
    }

    [HttpGet("{id:guid}/leaderboard")]
    [Authorize]
    [ProducesResponseType(typeof(List<LeaderboardEntryDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetLeaderboard(Guid id, CancellationToken cancellationToken)
    {
        var query = new GetLeaderboardQuery(id);
        var result = await _mediator.Send(query, cancellationToken);

        return Ok(result);
    }

    [HttpGet("{id:guid}/sync")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(SyncGameSessionResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> SyncGameSession(Guid id, [FromQuery] Guid? playerId, CancellationToken cancellationToken)
    {
        var query = new SyncGameSessionQuery(id, playerId);
        var result = await _mediator.Send(query, cancellationToken);

        return Ok(result
        );
    }
}
