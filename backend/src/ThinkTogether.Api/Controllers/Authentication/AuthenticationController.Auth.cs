using Application.Handlers.User.Queries.GetCurrentUser;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ThinkTogether.Api.Models;
using ThinkTogether.Api.Models.ResponseModels.Authentication;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Handlers.User.Commands.LoginUser;
using ThinkTogether.Application.Handlers.User.Commands.LogoutUser;
using ThinkTogether.Application.Handlers.User.Commands.RefreshToken;
using ThinkTogether.Application.Handlers.User.Commands.RegisterUser;

namespace ThinkTogether.Api.Controllers.Authentication;

public partial class AuthenticationController
{
    [HttpPost("register")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<RegisterResponse>), StatusCodes.Status201Created)]
    public async Task<IActionResult> Register(
        [FromBody] RegisterUserCommand command,
        CancellationToken cancellationToken)
    {
        await _mediator.Send(command, cancellationToken);

        return CreatedAtAction(nameof(GetCurrentUser), null, new ApiResponse<RegisterResponse>
        {
            Success = true,
            Message = "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.",
            Data = new RegisterResponse(EmailConfirmed: false)
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
                Instance = Request.Path
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
}
