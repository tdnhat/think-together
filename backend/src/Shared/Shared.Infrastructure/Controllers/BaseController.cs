using Microsoft.AspNetCore.Mvc;
using MediatR;
using System.Threading.Tasks;

namespace Shared.Infrastructure.Controllers;

[ApiController]
[Route("api/[controller]")]
public abstract class BaseController : ControllerBase
{
    protected readonly IMediator Mediator;

    protected BaseController(IMediator mediator)
    {
        Mediator = mediator;
    }

    protected async Task<IActionResult> SendCommandAsync<TResponse>(IRequest<TResponse> request)
    {
        var result = await Mediator.Send(request);
        return Ok(result);
    }

    protected async Task<IActionResult> SendCommandAsync(IRequest request)
    {
        await Mediator.Send(request);
        return Ok();
    }
}
