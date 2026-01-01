using MediatR;
using Microsoft.AspNetCore.Mvc;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Api.Controllers.Class;

public partial class ClassController
{
    [HttpPost("{id}/upload-cover")]
    [Consumes("multipart/form-data")]
    [ProducesResponseType(typeof(ClassDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> UploadCoverImage(
        Guid id,
        IFormFile coverImage,
        CancellationToken cancellationToken)
    {
        var command = new ThinkTogether.Application.Handlers.Class.Commands.UploadClassCover.UploadClassCoverCommand(id, coverImage);
        var result = await _mediator.Send(command, cancellationToken);

        return Ok(result);
    }
}
