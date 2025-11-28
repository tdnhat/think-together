using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ThinkTogether.Application.Handlers.User.Queries.GetUserCreatorStatus;

namespace ThinkTogether.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/users")]
public class UserController : ControllerBase
{
    private readonly IMediator _mediator;

    public UserController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("creator-status")]
    public async Task<IActionResult> GetCreatorStatus()
    {
        var result = await _mediator.Send(new GetUserCreatorStatusQuery());
        return Ok(result);
    }
}
