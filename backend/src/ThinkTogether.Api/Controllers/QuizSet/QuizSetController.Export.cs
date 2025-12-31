using Microsoft.AspNetCore.Mvc;

namespace ThinkTogether.Api.Controllers.QuizSet;

public partial class QuizSetController
{
    [HttpGet("{id}/export-pdf")]
    [ProducesResponseType(typeof(FileContentResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> ExportToPdf(Guid id, CancellationToken cancellationToken)
    {
        try 
        {
            var pdfBytes = await _pdfExportService.ExportQuizSetAsync(id, cancellationToken);
            return File(pdfBytes, "application/pdf", $"quiz-export-{id}.pdf");
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
