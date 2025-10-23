using Domain.Exceptions;

using Shared.Primitives;

namespace Domain.Aggregates.QuizSetAggregate.ValueObjects;

public sealed class MediaUrl : ValueObject
{
    public string Url { get; }

    public MediaType Type { get; }

    private MediaUrl(string url, MediaType type)
    {
        Url = url;
        Type = type;
    }

    public static MediaUrl Create(string url, MediaType type)
    {
        if (string.IsNullOrWhiteSpace(url))
            throw new ValidationException("URL media là bắt buộc");

        if (url.Length > 500)
            throw new ValidationException("URL media quá dài");

        // Basic URL validation
        if (!Uri.TryCreate(url, UriKind.Absolute, out _))
            throw new ValidationException("URL media không hợp lệ");

        return new MediaUrl(url.Trim(), type);
    }

    protected override IEnumerable<object?> GetEqualityComponents()
    {
        yield return Url;
        yield return Type;
    }

    public override string ToString() => Url;

    public static implicit operator string(MediaUrl mediaUrl) => mediaUrl.Url;
}

public enum MediaType
{
    Image,
    Video,
    Audio
}