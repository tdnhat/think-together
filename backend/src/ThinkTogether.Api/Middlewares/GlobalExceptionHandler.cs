using FluentValidation;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Shared.Common;

namespace Api.Middlewares;

public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        _logger.LogError(exception, "Exception occurred: {Message}", exception.Message);

        var problemDetails = CreateProblemDetails(httpContext, exception);
        httpContext.Response.StatusCode = problemDetails.Status ?? StatusCodes.Status500InternalServerError;

        await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);

        return true;
    }

    private static ProblemDetails CreateProblemDetails(HttpContext httpContext, Exception exception)
    {
        return exception switch
        {
            ValidationException validationException => CreateValidationProblemDetails(httpContext, validationException),

            DomainException domainException => CreateDomainProblemDetails(httpContext, domainException),

            _ => new ProblemDetails
            {
                Type = "https://tools.ietf.org/html/rfc7231#section-6.6.1",
                Title = "Internal Server Error",
                Status = StatusCodes.Status500InternalServerError,
                Detail = "Đã có lỗi xảy ra khi xử lý yêu cầu của bạn.",
                Instance = httpContext.Request.Path
            }
        };
    }

    private static ProblemDetails CreateValidationProblemDetails(
        HttpContext httpContext,
        ValidationException exception)
    {
        var problemDetails = new ProblemDetails
        {
            Status = StatusCodes.Status400BadRequest,
            Type = "https://tools.ietf.org/html/rfc7231#section-6.5.1",
            Title = "Validation Error",
            Detail = "Vui lòng kiểm tra lại các trường đã nhập.",
            Instance = $"{httpContext.Request.Method} {httpContext.Request.Path}"
        };

        var errors = exception.Errors
            .GroupBy(e => e.PropertyName)
            .ToDictionary(
                g => g.Key,
                g => g.Select(e => e.ErrorMessage).ToArray()
            );

        problemDetails.Extensions["errors"] = errors;

        return problemDetails;
    }

    private static ProblemDetails CreateDomainProblemDetails(HttpContext httpContext, DomainException domainException)
    {
        var statusCode = domainException.StatusCode;
        var type = GetStandardProblemType(statusCode);
        var title = GetStandardProblemTitle(statusCode);

        var problemDetails = new ProblemDetails
        {
            Type = type,
            Title = title,
            Status = statusCode,
            Detail = domainException.Message,
            Instance = httpContext.Request.Path
        };

        return problemDetails;
    }

    private static string GetStandardProblemType(int statusCode) => statusCode switch
    {
        400 => "https://tools.ietf.org/html/rfc7231#section-6.5.1",  // Bad Request
        401 => "https://tools.ietf.org/html/rfc7235#section-3.1",   // Unauthorized
        403 => "https://tools.ietf.org/html/rfc7231#section-6.5.3", // Forbidden
        404 => "https://tools.ietf.org/html/rfc7231#section-6.5.4", // Not Found
        409 => "https://tools.ietf.org/html/rfc7231#section-6.5.8", // Conflict
        422 => "https://tools.ietf.org/html/rfc4918#section-11.2",  // Unprocessable Entity
        500 => "https://tools.ietf.org/html/rfc7231#section-6.6.1", // Internal Server Error
        _ => "about:blank" // Default RFC 7807 type for unknown status codes
    };

    private static string GetStandardProblemTitle(int statusCode) => statusCode switch
    {
        400 => "Bad Request",
        401 => "Unauthorized",
        403 => "Forbidden",
        404 => "Not Found",
        409 => "Conflict",
        422 => "Unprocessable Entity",
        500 => "Internal Server Error",
        _ => "An error occurred"
    };
}
