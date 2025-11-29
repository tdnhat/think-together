using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ThinkTogether.Api.Models;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Handlers.QuizSet.Commands.CreateQuizSet;
using ThinkTogether.Application.Handlers.QuizSet.Commands.DeleteQuizSet;
using ThinkTogether.Application.Handlers.QuizSet.Commands.PublishQuizSet;
using ThinkTogether.Application.Handlers.QuizSet.Commands.UpdateQuizSet;
using ThinkTogether.Application.Handlers.QuizSet.Commands.CreateQuestion;
using ThinkTogether.Application.Handlers.QuizSet.Commands.UpdateQuestion;
using ThinkTogether.Application.Handlers.QuizSet.Commands.DeleteQuestion;
using ThinkTogether.Application.Handlers.QuizSet.Commands.DuplicateQuizSet;
using ThinkTogether.Application.Handlers.QuizSet.Commands.DuplicateQuestion;
using ThinkTogether.Application.Handlers.QuizSet.Commands.ReorderQuestions;
using ThinkTogether.Application.Handlers.QuizSet.Commands.UploadCoverImage;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Application.Handlers.QuizSet.Queries.GetAllQuizSets;
using ThinkTogether.Application.Handlers.QuizSet.Queries.GetPublicQuizzes;
using ThinkTogether.Application.Handlers.QuizSet.Queries.GetQuizSetById;
using ThinkTogether.Application.Handlers.QuizSet.Queries.GetQuestionsByQuizSetId;
using ThinkTogether.Application.Handlers.QuizSet.Queries.GetQuestionById;
using ThinkTogether.Shared.Common;

namespace ThinkTogether.Api.Controllers;

[ApiController]
[Route("api/quiz-sets")]
[Authorize]
public class QuizSetController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IImageUploadService _imageUploadService;

    public QuizSetController(IMediator mediator, IImageUploadService imageUploadService)
    {
        _mediator = mediator;
        _imageUploadService = imageUploadService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(PaginatedResponse<QuizSetDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllQuizSets(
        [FromQuery] string? search,
        [FromQuery] string? sortBy,
        [FromQuery] string? filterBy,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        CancellationToken cancellationToken = default)
    {
        var result = await _mediator.Send(new GetAllQuizSetsQuery
        {
            Search = search,
            SortBy = sortBy,
            FilterBy = filterBy,
            Page = page,
            PageSize = pageSize
        }, cancellationToken);

        return Ok(result);
    }

    [HttpGet("public")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(PaginatedResponse<QuizSetDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPublicQuizzes(
        [FromQuery] string? search,
        [FromQuery] string? sortBy,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 12,
        CancellationToken cancellationToken = default)
    {
        var result = await _mediator.Send(new GetPublicQuizzesQuery
        {
            Search = search,
            SortBy = sortBy,
            Page = page,
            PageSize = pageSize
        }, cancellationToken);

        return Ok(result);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ApiResponse<QuizSetDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetQuizSetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetQuizSetByIdQuery(id), cancellationToken);

        return Ok(new ApiResponse<QuizSetDto>
        {
            Success = true,
            Message = "Bộ trắc nghiệm được tải thành công",
            Data = result
        });
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<QuizSetDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateQuizSet(
        [FromBody] CreateQuizSetCommand command,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(command, cancellationToken);

        return CreatedAtAction(nameof(GetAllQuizSets), null, new ApiResponse<QuizSetDto>
        {
            Success = true,
            Message = "Bộ trắc nghiệm đã được tạo thành công",
            Data = result
        });
    }

    [HttpPut("{id}")]
    [ProducesResponseType(typeof(ApiResponse<QuizSetDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> UpdateQuizSet(
        Guid id,
        [FromBody] UpdateQuizSetCommand command,
        CancellationToken cancellationToken)
    {
        if (id != command.Id)
            return BadRequest(new ProblemDetails
            {
                Type = "https://tools.ietf.org/html/rfc7231#section-6.5.1",
                Title = "Bad Request",
                Status = StatusCodes.Status400BadRequest,
                Detail = "ID in URL does not match ID in body",
                Instance = HttpContext.Request.Path
            });

        var result = await _mediator.Send(command, cancellationToken);

        return Ok(new ApiResponse<QuizSetDto>
        {
            Success = true,
            Message = "Bộ trắc nghiệm đã được cập nhật thành công",
            Data = result
        });
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> DeleteQuizSet(Guid id, CancellationToken cancellationToken)
    {
        await _mediator.Send(new DeleteQuizSetCommand(id), cancellationToken);

        return NoContent();
    }

    [HttpPost("{id}/publish")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> PublishQuizSet(Guid id, CancellationToken cancellationToken)
    {
        await _mediator.Send(new PublishQuizSetCommand(id), cancellationToken);

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Bộ trắc nghiệm đã được xuất bản thành công"
        });
    }

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
                Instance = HttpContext.Request.Path
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
                Instance = HttpContext.Request.Path
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
                Instance = HttpContext.Request.Path
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
        var command = new UploadCoverImageCommand(id, coverImage);
        var result = await _mediator.Send(command, cancellationToken);

        return Ok(new ApiResponse<QuizSetDto>
        {
            Success = true,
            Message = "Ảnh bìa đã được tải lên thành công",
            Data = result
        });
    }

    [HttpPost("{id}/duplicate")]
    [ProducesResponseType(typeof(ApiResponse<QuizSetDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> DuplicateQuizSet(Guid id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new DuplicateQuizSetCommand(id), cancellationToken);

        return CreatedAtAction(
            nameof(GetQuizSetById),
            new { id = result.Id },
            new ApiResponse<QuizSetDto>
            {
                Success = true,
                Message = "Bộ trắc nghiệm đã được sao chép thành công",
                Data = result
            });
    }

    // Question endpoints
    [HttpGet("{id}/questions")]
    [ProducesResponseType(typeof(PaginatedResponse<QuestionDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetQuestionsByQuizSetId(
        Guid id,
        [FromQuery] string? search,
        [FromQuery] string? filterBy,
        [FromQuery] string? sortBy,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50,
        CancellationToken cancellationToken = default)
    {
        var result = await _mediator.Send(new GetQuestionsByQuizSetIdQuery(id)
        {
            Search = search,
            FilterBy = filterBy,
            SortBy = sortBy,
            Page = page,
            PageSize = pageSize
        }, cancellationToken);

        return Ok(result);
    }

    [HttpGet("{id}/questions/{questionId}")]
    [ProducesResponseType(typeof(ApiResponse<QuestionDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetQuestionById(Guid id, Guid questionId, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetQuestionByIdQuery(id, questionId), cancellationToken);

        return Ok(new ApiResponse<QuestionDto>
        {
            Success = true,
            Message = "Câu hỏi được tải thành công",
            Data = result
        });
    }

    [HttpPost("{id}/questions")]
    [ProducesResponseType(typeof(ApiResponse<QuestionDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> CreateQuestion(
        Guid id,
        [FromBody] CreateQuestionCommand command,
        CancellationToken cancellationToken)
    {
        if (id != command.QuizSetId)
            return BadRequest(new ProblemDetails
            {
                Type = "https://tools.ietf.org/html/rfc7231#section-6.5.1",
                Title = "Bad Request",
                Status = StatusCodes.Status400BadRequest,
                Detail = "ID trong URL không khớp với ID trong body",
                Instance = HttpContext.Request.Path
            });

        var result = await _mediator.Send(command, cancellationToken);

        return CreatedAtAction(
            nameof(GetQuestionById),
            new { id = command.QuizSetId, questionId = result.Id },
            new ApiResponse<QuestionDto>
            {
                Success = true,
                Message = "Câu hỏi đã được tạo thành công",
                Data = result
            });
    }

    [HttpPut("{id}/questions/{questionId}")]
    [ProducesResponseType(typeof(ApiResponse<QuestionDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> UpdateQuestion(
        Guid id,
        Guid questionId,
        [FromBody] UpdateQuestionCommand command,
        CancellationToken cancellationToken)
    {
        if (id != command.QuizSetId || questionId != command.QuestionId)
            return BadRequest(new ProblemDetails
            {
                Type = "https://tools.ietf.org/html/rfc7231#section-6.5.1",
                Title = "Bad Request",
                Status = StatusCodes.Status400BadRequest,
                Detail = "ID trong URL không khớp với ID trong body",
                Instance = HttpContext.Request.Path
            });

        var result = await _mediator.Send(command, cancellationToken);

        return Ok(new ApiResponse<QuestionDto>
        {
            Success = true,
            Message = "Câu hỏi đã được cập nhật thành công",
            Data = result
        });
    }

    [HttpDelete("{id}/questions/{questionId}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> DeleteQuestion(Guid id, Guid questionId, CancellationToken cancellationToken)
    {
        await _mediator.Send(new DeleteQuestionCommand(id, questionId), cancellationToken);

        return NoContent();
    }

    [HttpPost("{id}/questions/{questionId}/duplicate")]
    [ProducesResponseType(typeof(ApiResponse<QuestionDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> DuplicateQuestion(Guid id, Guid questionId, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new DuplicateQuestionCommand(id, questionId), cancellationToken);

        return CreatedAtAction(
            nameof(GetQuestionById),
            new { id, questionId = result.Id },
            new ApiResponse<QuestionDto>
            {
                Success = true,
                Message = "Câu hỏi đã được sao chép thành công",
                Data = result
            });
    }

    [HttpPut("{id}/questions/reorder")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> ReorderQuestions(
        Guid id,
        [FromBody] ReorderQuestionsCommand command,
        CancellationToken cancellationToken)
    {
        if (id != command.QuizSetId)
            return BadRequest(new ProblemDetails
            {
                Type = "https://tools.ietf.org/html/rfc7231#section-6.5.1",
                Title = "Bad Request",
                Status = StatusCodes.Status400BadRequest,
                Detail = "ID trong URL không khớp với ID trong body",
                Instance = HttpContext.Request.Path
            });

        await _mediator.Send(command, cancellationToken);

        return NoContent();
    }
}

