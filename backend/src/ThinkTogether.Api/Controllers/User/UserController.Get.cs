using Microsoft.AspNetCore.Mvc;
using ThinkTogether.Application.Handlers.User.Queries.GetUserCreatorStatus;

namespace ThinkTogether.Api.Controllers.User;

public partial class UserController
{
    [HttpGet("creator-status")]
    public async Task<IActionResult> GetCreatorStatus()
    {
        var result = await _mediator.Send(new GetUserCreatorStatusQuery());
        return Ok(result);
    }
}
