using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ThinkTogether.Application.Handlers.Dashboard.Queries.GetDashboardCharts;
using ThinkTogether.Application.Handlers.Dashboard.Queries.GetDashboardCounts;
using ThinkTogether.Application.Handlers.Dashboard.Queries.GetRecentActivity;

namespace ThinkTogether.Api.Controllers.Admin;

[Route("api/admin/dashboard")]
[ApiController]
[Authorize(Roles = "Administrator")]
public class DashboardController : ControllerBase
{
    private readonly ISender _sender;

    public DashboardController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet("counts")]
    public async Task<IActionResult> GetCounts(CancellationToken cancellationToken)
    {
        var query = new GetDashboardCountsQuery();
        var result = await _sender.Send(query, cancellationToken);
        return Ok(result);
    }

    [HttpGet("charts")]
    public async Task<IActionResult> GetCharts(CancellationToken cancellationToken)
    {
        var query = new GetDashboardChartsQuery();
        var result = await _sender.Send(query, cancellationToken);
        return Ok(result);
    }

    [HttpGet("recent")]
    public async Task<IActionResult> GetRecentActivity(CancellationToken cancellationToken)
    {
        var query = new GetRecentActivityQuery();
        var result = await _sender.Send(query, cancellationToken);
        return Ok(result);
    }
}
