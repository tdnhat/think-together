using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Handlers.Challenge.Queries.GetChallengeByQuizSetId;
using ThinkTogether.Application.Handlers.Challenge.Queries.GetChallengeByShareLink;
using ThinkTogether.Application.Handlers.Challenge.Queries.GetChallengeStats;
using ThinkTogether.Application.Handlers.Challenge.Queries.GetLeaderboard;

namespace ThinkTogether.Api.Controllers.Challenge;

public partial class ChallengeController
{
    [HttpGet("by-link/{shareLink}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ChallengeDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetChallengeByShareLink(
        string shareLink,
        CancellationToken cancellationToken)
    {
        var query = new GetChallengeByShareLinkQuery(shareLink);
        var result = await _mediator.Send(query, cancellationToken);

        return Ok(result);
    }

    [HttpGet("by-quiz/{quizSetId:guid}")]
    [ProducesResponseType(typeof(ChallengeDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ChallengeDto), StatusCodes.Status204NoContent)]
    public async Task<IActionResult> GetChallengeByQuizSetId(
        Guid quizSetId,
        CancellationToken cancellationToken)
    {
        var query = new GetChallengeByQuizSetIdQuery(quizSetId);
        var result = await _mediator.Send(query, cancellationToken);

        if (result == null)
        {
            return NoContent();
        }

        return Ok(result);
    }

    [HttpGet("{challengeId:guid}/leaderboard")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ChallengeLeaderboardDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetLeaderboard(
        Guid challengeId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50,
        CancellationToken cancellationToken = default)
    {
        var query = new GetLeaderboardQuery(challengeId, page, pageSize);
        var result = await _mediator.Send(query, cancellationToken);

        return Ok(result);
    }

    [HttpGet("{challengeId:guid}/stats")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ChallengeStatsDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetChallengeStats(
        Guid challengeId,
        CancellationToken cancellationToken = default)
    {
        var query = new GetChallengeStatsQuery(challengeId);
        var result = await _mediator.Send(query, cancellationToken);

        return Ok(result);
    }
}
