using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Interfaces;

/// <summary>
/// Service for generating PDF exports of quiz and challenge data.
/// Supports exporting attempt results, leaderboards, and statistics.
/// </summary>
public interface IPdfExportService
{
    /// <summary>
    /// Export a single challenge attempt as a PDF.
    /// Contains attempt details, score, and question-by-question review.
    /// </summary>
    /// <param name="attemptDto">The challenge attempt data</param>
    /// <param name="challengeTitle">Title of the challenge</param>
    /// <param name="quizSetTitle">Title of the quiz set</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>PDF file as byte array</returns>
    Task<byte[]> ExportAttemptReportAsync(
        ChallengeAttemptDto attemptDto,
        string challengeTitle,
        string quizSetTitle,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Export a leaderboard as a PDF.
    /// Contains rankings and performance metrics for all participants.
    /// </summary>
    /// <param name="leaderboardDto">The leaderboard data</param>
    /// <param name="challengeTitle">Title of the challenge</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>PDF file as byte array</returns>
    Task<byte[]> ExportLeaderboardAsync(
        ChallengeLeaderboardDto leaderboardDto,
        string challengeTitle,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Export challenge statistics as a PDF.
    /// Contains analytics and performance insights for instructors/creators.
    /// </summary>
    /// <param name="statsDto">The challenge statistics data</param>
    /// <param name="challengeTitle">Title of the challenge</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>PDF file as byte array</returns>
    Task<byte[]> ExportStatisticsAsync(
        ChallengeStatsDto statsDto,
        string challengeTitle,
        CancellationToken cancellationToken = default);
}
