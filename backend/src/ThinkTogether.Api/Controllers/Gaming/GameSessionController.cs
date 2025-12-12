using MediatR;
using Microsoft.AspNetCore.Mvc;
using ThinkTogether.Application.Interfaces;

namespace ThinkTogether.Api.Controllers.Gaming;

[ApiController]
[Route("api/game-sessions")]
public partial class GameSessionController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IGameSessionNotificationService _notificationService;

    public GameSessionController(
        IMediator mediator,
        IGameSessionNotificationService notificationService)
    {
        _mediator = mediator;
        _notificationService = notificationService;
    }
}
