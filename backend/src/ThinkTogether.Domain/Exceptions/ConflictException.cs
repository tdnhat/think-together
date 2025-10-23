using Shared.Common;

namespace Domain.Exceptions;

public class ConflictException : DomainException
{
    public ConflictException(string message) : base(message, 409)
    {
    }

    public ConflictException(string message, Exception innerException)
        : base(message, innerException, 409)
    {
    }
}

