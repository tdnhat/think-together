using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ThinkTogether.Api.Controllers.Authentication;

[ApiController]
[Route("api/auth")]
public partial class AuthenticationController : ControllerBase
{
    private readonly IMediator _mediator;
    private const string RefreshTokenCookieName = "refreshToken";

    public AuthenticationController(IMediator mediator)
    {
        _mediator = mediator;
    }
}
