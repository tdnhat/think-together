using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Services;

namespace ThinkTogether.Infrastructure.Services;

public class ShareLinkGeneratorService : IShareLinkGeneratorService
{
    public string GenerateShareLink()
    {
        // Generate a short unique code for the share link
        // Using 8 characters of a GUID for simplicity
        return Guid.NewGuid().ToString("N")[..8];
    }
}

