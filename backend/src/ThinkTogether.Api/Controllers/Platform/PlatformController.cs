using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ThinkTogether.Api.Models;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Handlers.Platform.Queries.GetPlatformStats;

namespace ThinkTogether.Api.Controllers.Platform;

[ApiController]
[Route("api/platform")]
public class PlatformController : ControllerBase
{
    private readonly IMediator _mediator;

    public PlatformController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("stats")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<PlatformStatsDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPlatformStats(CancellationToken cancellationToken = default)
    {
        var query = new GetPlatformStatsQuery();
        var result = await _mediator.Send(query, cancellationToken);

        return Ok(new ApiResponse<PlatformStatsDto>
        {
            Success = true,
            Data = result
        });
    }
}

