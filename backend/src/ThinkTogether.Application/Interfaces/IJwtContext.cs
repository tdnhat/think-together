namespace ThinkTogether.Application.Interfaces;

public interface IJwtContext
{
    string? Jti { get; }
    DateTime? TokenExpiry { get; }
}
