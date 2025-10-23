using Shared.Common;

namespace Domain.Exceptions;

public class ValidationException : DomainException
{
    public ValidationException(string message) : base(message, 400)
    {
    }

    public ValidationException(string message, Exception innerException)
        : base(message, innerException, 400)
    {
    }
}

