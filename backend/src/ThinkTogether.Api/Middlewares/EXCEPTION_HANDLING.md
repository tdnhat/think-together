# Global Exception Handling

## Overview

The application uses a centralized `GlobalExceptionHandler` middleware to handle all exceptions consistently. This follows the principle of **fail fast, report clearly**.

## Architecture

```
Request
  ↓
Controller (delegates to MediatR)
  ↓
Handler (executes command/query)
  ↓
Application/Domain Layer (validates, executes logic)
  ↓
Exception thrown ❌
  ↓
GlobalExceptionHandler (catches all)
  ↓
Exception Transformation (determines HTTP status)
  ↓
ProblemDetails Response (RFC 7807 format)
  ↓
Response
```

## How It Works

### 1. Exception Types Handled

#### ValidationException
**Source:** FluentValidation  
**HTTP Status:** 400 Bad Request  
**Response:**
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "Validation Error",
  "status": 400,
  "detail": "Please check your input fields",
  "instance": "POST /api/quiz-sets",
  "extensions": {
    "errors": {
      "title": ["Title is required", "Title must be less than 200 characters"],
      "description": ["Description must be less than 1000 characters"]
    }
  }
}
```

#### DomainException
**Source:** Domain layer  
**HTTP Status:** Varies (from exception)  
**Response:**
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.4",
  "title": "Not Found",
  "status": 404,
  "detail": "Game session not found",
  "instance": "GET /api/game-sessions/123"
}
```

#### All Other Exceptions
**Source:** Any unhandled exception  
**HTTP Status:** 500 Internal Server Error  
**Response:**
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.6.1",
  "title": "Internal Server Error",
  "status": 500,
  "detail": "An error occurred while processing your request",
  "instance": "POST /api/something"
}
```

## Exception Types in Application

### ValidationException (FluentValidation)
Used for input validation:
```csharp
public class CreateQuizValidator : AbstractValidator<CreateQuizCommand>
{
    public CreateQuizValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required")
            .MaximumLength(200).WithMessage("Title must be less than 200 characters");
    }
}

// When validation fails:
// FluentValidation throws ValidationException
// GlobalExceptionHandler catches it
// Returns 400 with field-level error messages
```

### DomainException
Used for business logic violations:
```csharp
public class GameSession
{
    public void StartGame()
    {
        if (Status != GameStatus.Waiting)
            throw new DomainException(
                "Game can only be started from Waiting status",
                StatusCodes.Status400BadRequest);
    }
}

// When business rule is violated:
// Domain throws DomainException with status code
// GlobalExceptionHandler catches it
// Returns appropriate HTTP status with message
```

## Status Code Mapping

| HTTP Status | RFC URI | When to Use |
|------------|---------|------------|
| 400 | rfc7231#section-6.5.1 | Bad Request (validation, invalid input) |
| 401 | rfc7235#section-3.1 | Unauthorized (auth required) |
| 403 | rfc7231#section-6.5.3 | Forbidden (insufficient permissions) |
| 404 | rfc7231#section-6.5.4 | Not Found (resource doesn't exist) |
| 409 | rfc7231#section-6.5.8 | Conflict (business rule violation) |
| 422 | rfc4918#section-11.2 | Unprocessable Entity (semantic error) |
| 500 | rfc7231#section-6.6.1 | Internal Server Error (unexpected error) |

## Implementation Details

### GlobalExceptionHandler Code Flow
```csharp
public async ValueTask<bool> TryHandleAsync(
    HttpContext httpContext,
    Exception exception,
    CancellationToken cancellationToken)
{
    // 1. Log the exception
    _logger.LogError(exception, "Exception occurred: {Message}", exception.Message);

    // 2. Determine response type
    var problemDetails = exception switch
    {
        ValidationException validationException 
            => CreateValidationProblemDetails(httpContext, validationException),
        
        DomainException domainException 
            => CreateDomainProblemDetails(httpContext, domainException),
        
        _ => new ProblemDetails
        {
            Type = "https://tools.ietf.org/html/rfc7231#section-6.6.1",
            Title = "Internal Server Error",
            Status = StatusCodes.Status500InternalServerError,
            Detail = "An error occurred while processing your request",
            Instance = httpContext.Request.Path
        }
    };

    // 3. Set response status code
    httpContext.Response.StatusCode = problemDetails.Status 
        ?? StatusCodes.Status500InternalServerError;

    // 4. Write response
    await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);

    return true;
}
```

## When NOT to Handle Exceptions in Controllers

### ❌ DON'T Do This
```csharp
public async Task<IActionResult> ReconnectPlayer(
    [FromBody] ReconnectPlayerRequest request,
    CancellationToken cancellationToken)
{
    var result = await _mediator.Send(command, cancellationToken);

    // ❌ Don't manually check result and return error
    if (!result.Success)
    {
        return NotFound(new ApiResponse<object>
        {
            Success = false,
            Message = "Cannot reconnect"
        });
    }

    return Ok(result);
}
```

### ✅ DO This Instead
```csharp
public async Task<IActionResult> ReconnectPlayer(
    [FromBody] ReconnectPlayerRequest request,
    CancellationToken cancellationToken)
{
    var result = await _mediator.Send(command, cancellationToken);

    // ✅ Let exception bubble up
    // If result is invalid, handler throws exception
    // GlobalExceptionHandler catches and responds appropriately

    return Ok(new ApiResponse<ReconnectPlayerResult> { Data = result });
}
```

## Exception Hierarchy

```
Exception
├── ValidationException (FluentValidation)
│   └── GlobalExceptionHandler
│       → 400 Bad Request
│
├── DomainException (Custom)
│   └── GlobalExceptionHandler
│       → Status from exception
│
└── All Others
    └── GlobalExceptionHandler
        → 500 Internal Server Error
```

## Throwing Custom Domain Exceptions

### Basic Usage
```csharp
// In domain layer
throw new DomainException(
    message: "Insufficient credits",
    statusCode: StatusCodes.Status400BadRequest);
```

### In Command Handler
```csharp
public class ReconnectPlayerCommandHandler : IRequestHandler<ReconnectPlayerCommand, ReconnectPlayerResult>
{
    public async Task<ReconnectPlayerResult> Handle(
        ReconnectPlayerCommand request,
        CancellationToken cancellationToken)
    {
        var session = await _repository.GetByPinAsync(request.Pin, cancellationToken);
        
        if (session == null)
            throw new DomainException(
                "Game session not found",
                StatusCodes.Status404NotFound);

        // Business logic here
        return result;
    }
}
```

## Response Format (RFC 7807)

All error responses follow RFC 7807 Problem Details format:

```json
{
  "type": "string - URI identifying the error type",
  "title": "string - Short title for the error",
  "status": 400,
  "detail": "string - Detailed explanation",
  "instance": "string - Path where error occurred",
  "extensions": {
    "errors": {
      "fieldName": ["error message 1", "error message 2"]
    }
  }
}
```

## Middleware Registration

### Program.cs
```csharp
// Register exception handler
services.AddExceptionHandler<GlobalExceptionHandler>();
services.AddProblemDetails();

// Activate in pipeline
app.UseExceptionHandler();
```

## Testing Exception Handling

### Unit Test
```csharp
[Fact]
public async Task Handle_WithInvalidPin_ThrowsDomainException()
{
    var handler = new ReconnectPlayerCommandHandler(repository);
    var command = new ReconnectPlayerCommand(invalidPin, playerId);

    await Assert.ThrowsAsync<DomainException>(
        () => handler.Handle(command, CancellationToken.None));
}
```

### Integration Test
```csharp
[Fact]
public async Task Reconnect_WithInvalidPin_Returns404()
{
    var response = await client.PostAsJsonAsync(
        "/api/game-sessions/reconnect",
        new { pin = "INVALID", playerId = Guid.NewGuid() });

    Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    var content = await response.Content.ReadAsAsync<ProblemDetails>();
    Assert.Equal(404, content.Status);
}
```

## Summary

1. **Throw exceptions in domain/application layers** for validation and business rule violations
2. **Don't catch exceptions in controllers** - let them bubble up
3. **GlobalExceptionHandler catches and transforms** all exceptions
4. **RFC 7807 format used** for consistent error responses
5. **Status codes determined** by exception type
6. **Validation errors include field-level details** for client guidance
7. **All exceptions logged** for monitoring and debugging
