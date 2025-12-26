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
    private readonly IPdfExportService _pdfExportService;

    public QuizSetController(
        IMediator mediator, 
        IImageUploadService imageUploadService,
        IPdfExportService pdfExportService)
    {
        _mediator = mediator;
        _imageUploadService = imageUploadService;
        _pdfExportService = pdfExportService;
    }
}
