using Domain.Exceptions;

using Shared.Primitives;

namespace Domain.Aggregates.ChallengeAggregate.ValueObjects;

public sealed class ShareableLink : ValueObject
{
    public string Value { get; }

    private ShareableLink(string value)
    {
        Value = value;
    }

    public static ShareableLink Create(string link)
    {
        if (string.IsNullOrWhiteSpace(link))
            throw new ValidationException("Liên kết chia sẻ là bắt buộc");

        link = link.Trim();

        if (link.Length > 500)
            throw new ValidationException("Liên kết chia sẻ quá dài");

        // Basic URL validation
        if (!Uri.TryCreate(link, UriKind.Absolute, out _))
            throw new ValidationException("Liên kết chia sẻ không hợp lệ");

        return new ShareableLink(link);
    }

    public static ShareableLink Generate(int challengeId, string baseUrl)
    {
        if (string.IsNullOrWhiteSpace(baseUrl))
            throw new ValidationException("URL cơ sở là bắt buộc");

        var link = $"{baseUrl.TrimEnd('/')}/challenge/{challengeId}";
        return new ShareableLink(link);
    }

    protected override IEnumerable<object?> GetEqualityComponents()
    {
        yield return Value;
    }

    public override string ToString() => Value;

    public static implicit operator string(ShareableLink link) => link.Value;
}

