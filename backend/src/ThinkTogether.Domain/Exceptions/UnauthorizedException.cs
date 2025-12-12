using Shared.Common;

namespace ThinkTogether.Domain.Exceptions;

public class UnauthorizedException : DomainException
{
    public UnauthorizedException(string message) : base(message, 401)
    {
    }

    public UnauthorizedException(string message, Exception innerException)
        : base(message, innerException, 401)
    {
    }
}
