using Microsoft.AspNetCore.Mvc;
using ThinkTogether.Api.Models;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Api.Controllers.QuizSet;

public partial class QuizSetController
{
    [HttpPost("upload-cover-temp")]
    [Consumes("multipart/form-data")]
    [ProducesResponseType(typeof(ApiResponse<string>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UploadCoverImageTemp(
        IFormFile coverImage,
        CancellationToken cancellationToken)
    {
        if (coverImage == null || coverImage.Length == 0)
        {
            return BadRequest(new ProblemDetails
            {
                Type = "https://tools.ietf.org/html/rfc7231#section-6.5.1",
                Title = "Bad Request",
                Status = StatusCodes.Status400BadRequest,
                Detail = "File ảnh không được trống",
                Instance = Request.Path
            });
        }

        try
        {
            var imageUrl = await _imageUploadService.UploadImageAsync(
                coverImage,
                "quiz-sets/covers",
                cancellationToken);

            return Ok(new ApiResponse<string>
            {
                Success = true,
                Message = "Ảnh bìa đã được tải lên thành công",
                Data = imageUrl
            });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new ProblemDetails
            {
                Type = "https://tools.ietf.org/html/rfc7231#section-6.5.1",
                Title = "Bad Request",
                Status = StatusCodes.Status400BadRequest,
                Detail = ex.Message,
                Instance = Request.Path
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new ProblemDetails
            {
                Type = "https://tools.ietf.org/html/rfc7231#section-6.5.1",
                Title = "Bad Request",
                Status = StatusCodes.Status400BadRequest,
                Detail = ex.Message,
                Instance = Request.Path
            });
        }
    }

    [HttpPost("{id}/upload-cover")]
    [Consumes("multipart/form-data")]
    [ProducesResponseType(typeof(ApiResponse<QuizSetDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> UploadCoverImage(
        Guid id,
        IFormFile coverImage,
        CancellationToken cancellationToken)
    {
        var command = new ThinkTogether.Application.Handlers.QuizSet.Commands.UploadCoverImage.UploadCoverImageCommand(id, coverImage);
        var result = await _mediator.Send(command, cancellationToken);

        return Ok(new ApiResponse<QuizSetDto>
        {
            Success = true,
            Message = "Ảnh bìa đã được tải lên thành công",
            Data = result
        });
    }
}
