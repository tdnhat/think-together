namespace ThinkTogether.Domain.Aggregates.ChallengeAggregate.Services;

/// <summary>
/// Service for generating unique share links for challenges.
/// </summary>
public interface IShareLinkGeneratorService
{
    /// <summary>
    /// Generates a unique share link for a challenge.
    /// </summary>
    /// <returns>A unique share link string</returns>
    string GenerateShareLink();
}

