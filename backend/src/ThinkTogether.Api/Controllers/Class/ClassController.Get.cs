using Microsoft.AspNetCore.Mvc;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Handlers.Class.Queries.GetClassById;
using ThinkTogether.Application.Handlers.Class.Queries.GetClasses;

namespace ThinkTogether.Api.Controllers.Class;

public partial class ClassController
{
    [HttpGet]
    [ProducesResponseType(typeof(ClassDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetClasses(
        [FromQuery] string? search = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var query = new GetClassesQuery(
            Search: search,
            Page: page,
            PageSize: pageSize);

        var result = await _mediator.Send(query, cancellationToken);

        return Ok(result);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ClassDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetClassById(
        [FromRoute] Guid id,
        CancellationToken cancellationToken = default)
    {
        var query = new GetClassByIdQuery(ClassId: id);
        var result = await _mediator.Send(query, cancellationToken);

        return Ok(result);
    }
}
