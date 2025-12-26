using Microsoft.AspNetCore.Mvc;

namespace ThinkTogether.Api.Controllers.QuizSet;

public partial class QuizSetController
{
    /// <summary>
    /// Export quiz set to PDF for paper examination
    /// </summary>
    /// <param name="id">Quiz set ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>PDF file</returns>
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
