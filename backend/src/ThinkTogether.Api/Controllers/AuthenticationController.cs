using Application.DTOs;
using Application.Handlers.User.Commands.LoginUser;
using Application.Handlers.User.Commands.RegisterUser;
using Application.Handlers.User.Commands.RefreshToken;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Application.Handlers.User.Queries.GetCurrentUser;

namespace Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthenticationController : ControllerBase
{
    private readonly IMediator _mediator;
    private const string RefreshTokenCookieName = "refreshToken";

    public AuthenticationController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("register")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(AuthTokenDto), StatusCodes.Status201Created)]
    public async Task<IActionResult> Register(
        [FromBody] RegisterUserCommand command,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetCurrentUser), result);
    }

    [HttpPost("login")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(AuthTokenDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> Login(
        [FromBody] LoginUserCommand command,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(command, cancellationToken);
        return Ok(result);
    }

    [HttpPost("refresh-token")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(AuthTokenDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> RefreshToken(CancellationToken cancellationToken)
    {
        string? refreshToken = null;

        if (Request.Cookies.TryGetValue(RefreshTokenCookieName, out var cookieToken))
        {
            refreshToken = cookieToken;
        }

        if (string.IsNullOrWhiteSpace(refreshToken))
            return Unauthorized(new ProblemDetails
            {
                Type = "https://tools.ietf.org/html/rfc7235#section-3.1",
                Title = "Unauthorized",
                Status = StatusCodes.Status401Unauthorized,
                Detail = "Refresh token không tồn tại.",
                Instance = HttpContext.Request.Path
            });

        var command = new RefreshTokenCommand(refreshToken);
        var response = await _mediator.Send(command, cancellationToken);

        return Ok(response);
    }

    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCurrentUser(CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetCurrentUserQuery(), cancellationToken);

        return Ok(result);
    }
}
