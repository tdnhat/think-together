using MediatR;
using Microsoft.AspNetCore.Mvc;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Handlers.Challenge.Queries.GetAttemptDetail;

namespace ThinkTogether.Api.Controllers.Challenge;

[ApiController]
[Route("api/challenges")]
public partial class ChallengeController : ControllerBase
{
    private readonly IMediator _mediator;

    public ChallengeController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("attempts/{attemptId}")]
    [ProducesResponseType(typeof(ChallengeAttemptDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAttemptDetail(
        Guid attemptId,
        CancellationToken cancellationToken = default)
    {
        var query = new GetAttemptDetailQuery(AttemptId: attemptId);
        var result = await _mediator.Send(query, cancellationToken);
        return Ok(result);
    }
}
