using Application.DTOs;
using Application.Handlers.User.Queries.GetCurrentUser;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ThinkTogether.Api.Models;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Handlers.User.Commands.ForgotPassword;
using ThinkTogether.Application.Handlers.User.Commands.LoginUser;
using ThinkTogether.Application.Handlers.User.Commands.LogoutUser;
using ThinkTogether.Application.Handlers.User.Commands.RegisterUser;
using ThinkTogether.Application.Handlers.User.Commands.RefreshToken;
using ThinkTogether.Application.Handlers.User.Commands.ResetPassword;
using ThinkTogether.Application.Handlers.User.Commands.ConfirmEmail;
using ThinkTogether.Application.Handlers.User.Commands.ResendEmailConfirmation;

namespace ThinkTogether.Api.Controllers;

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
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status201Created)]
    public async Task<IActionResult> Register(
        [FromBody] RegisterUserCommand command,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(command, cancellationToken);

        return CreatedAtAction(nameof(GetCurrentUser), null, new ApiResponse<object>
        {
            Success = true,
            Message = "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.",
            Data = new { EmailConfirmed = false }
        });
    }

    [HttpPost("login")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<AuthTokenDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Login(
        [FromBody] LoginUserCommand command,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(command, cancellationToken);

        // Set refresh token in cookie
        if (result.RefreshToken != null)
        {
            Response.Cookies.Append(RefreshTokenCookieName, result.RefreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.FromUnixTimeSeconds(result.ExpiresAt)
            });
        }

        return Ok(new ApiResponse<AuthTokenDto>
        {
            Success = true,
            Data = result.WithoutRefreshToken()
        });
    }

    [HttpPost("refresh-token")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<AuthTokenDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
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

        // Set new refresh token in cookie
        if (response.RefreshToken != null)
            Response.Cookies.Append(RefreshTokenCookieName, response.RefreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.FromUnixTimeSeconds(response.ExpiresAt)
            });

        return Ok(new ApiResponse<AuthTokenDto>
        {
            Success = true,
            Data = response
        });
    }

    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<UserDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCurrentUser(CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetCurrentUserQuery(), cancellationToken);

        return Ok(new ApiResponse<UserDto>
        {
            Success = true,
            Data = result
        });
    }

    [HttpPost("logout")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Logout(CancellationToken cancellationToken)
    {
        string? refreshToken = null;

        if (Request.Cookies.TryGetValue(RefreshTokenCookieName, out var cookieToken))
        {
            refreshToken = cookieToken;
        }

        if (string.IsNullOrWhiteSpace(refreshToken))
            return NoContent();

        var command = new LogoutUserCommand(refreshToken);
        await _mediator.Send(command, cancellationToken);

        // Clear refresh token cookie
        Response.Cookies.Delete(RefreshTokenCookieName);

        return NoContent();
    }

    [HttpPost("forgot-password")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> ForgotPassword(
        [FromBody] ForgotPasswordCommand command,
        CancellationToken cancellationToken)
    {
        await _mediator.Send(command, cancellationToken);

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Nếu email tồn tại trong hệ thống, bạn sẽ nhận được liên kết đặt lại mật khẩu"
        });
    }

    [HttpPost("reset-password")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ResetPassword(
        [FromBody] ResetPasswordCommand command,
        CancellationToken cancellationToken)
    {
        await _mediator.Send(command, cancellationToken);

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Mật khẩu đã được đặt lại thành công"
        });
    }

    [HttpPost("confirm-email")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ConfirmEmail(
        [FromBody] ConfirmEmailCommand command,
        CancellationToken cancellationToken)
    {
        await _mediator.Send(command, cancellationToken);

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Email đã được xác nhận thành công! Chào mừng bạn đến với ThinkTogether."
        });
    }

    [HttpPost("resend-email-confirmation")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ResendEmailConfirmation(
        [FromBody] ResendEmailConfirmationCommand command,
        CancellationToken cancellationToken)
    {
        await _mediator.Send(command, cancellationToken);

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Nếu email tồn tại trong hệ thống, bạn sẽ nhận được email xác nhận"
        });
    }
}