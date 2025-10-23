using Shared.Common;

namespace Domain.Exceptions;

public class ForbiddenException : DomainException
{
    public ForbiddenException(string message) : base(message, 403)
    {
    }

    public ForbiddenException(string message, Exception innerException)
        : base(message, innerException, 403)
    {
    }
}

