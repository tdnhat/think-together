using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ThinkTogether.Application.Interfaces;

namespace ThinkTogether.Api.Controllers.QuizSet;

[ApiController]
[Route("api/quiz-sets")]
[Authorize]
public partial class QuizSetController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IImageUploadService _imageUploadService;

    public QuizSetController(IMediator mediator, IImageUploadService imageUploadService)
    {
        _mediator = mediator;
        _imageUploadService = imageUploadService;
    }
}
