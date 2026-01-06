using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ThinkTogether.Application.Interfaces;

namespace ThinkTogether.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UploadController : ControllerBase
{
    private readonly IFileUploadService _uploadService;
    private readonly ILogger<UploadController> _logger;

    public UploadController(
        IFileUploadService uploadService,
        ILogger<UploadController> logger)
    {
        _uploadService = uploadService;
        _logger = logger;
    }

    [HttpPost("audio")]
    public async Task<IActionResult> UploadAudio(
        IFormFile file,
        CancellationToken cancellationToken = default)
    {
        try
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new
                {
                    error = "File không được trống"
                });
            }

            _logger.LogInformation("Audio upload request for file: {FileName}", file.FileName);

            var audioUrl = await _uploadService.UploadAudioAsync(
                file,
                "quiz-sets/audio",
                cancellationToken);

            _logger.LogInformation("Audio uploaded successfully: {Url}", audioUrl);

            return Ok(new
            {
                url = audioUrl,
                fileName = file.FileName,
                size = file.Length
            });
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Audio upload validation failed: {Message}", ex.Message);
            return BadRequest(new
            {
                error = ex.Message
            });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogError(ex, "Audio upload operation failed: {Message}", ex.Message);
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                error = ex.Message
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error during audio upload");
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                error = "Tải âm thanh lên thất bại"
            });
        }
    }

    [HttpPost("image")]
    public async Task<IActionResult> UploadImage(
        IFormFile file,
        [FromQuery] string folder = "quiz-sets/images",
        CancellationToken cancellationToken = default)
    {
        try
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new
                {
                    error = "File không được trống"
                });
            }

            _logger.LogInformation("Image upload request for file: {FileName}", file.FileName);

            var imageUrl = await _uploadService.UploadImageAsync(
                file,
                folder,
                cancellationToken);

            _logger.LogInformation("Image uploaded successfully: {Url}", imageUrl);

            return Ok(new
            {
                url = imageUrl,
                fileName = file.FileName,
                size = file.Length
            });
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Image upload validation failed: {Message}", ex.Message);
            return BadRequest(new
            {
                error = ex.Message
            });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogError(ex, "Image upload operation failed: {Message}", ex.Message);
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                error = ex.Message
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error during image upload");
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                error = "Tải ảnh lên thất bại"
            });
        }
    }
}

