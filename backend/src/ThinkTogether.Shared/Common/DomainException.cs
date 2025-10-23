namespace Shared.Common;

public abstract class DomainException : Exception
{
    protected DomainException(string message, int statusCode = 500) : base(message)
    {
        StatusCode = statusCode;
    }

    protected DomainException(string message, Exception innerException, int statusCode = 500)
        : base(message, innerException)
    {
        StatusCode = statusCode;
    }

    public int StatusCode { get; }
}

