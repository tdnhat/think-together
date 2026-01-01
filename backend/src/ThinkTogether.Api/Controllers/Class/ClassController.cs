using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ThinkTogether.Api.Controllers.Class;

[ApiController]
[Route("api/classes")]
public partial class ClassController : ControllerBase
{
    private readonly IMediator _mediator;

    public ClassController(IMediator mediator)
    {
        _mediator = mediator;
    }
}
