using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Interfaces;

public interface IPdfExportService
{
    Task<byte[]> ExportAttemptReportAsync(
        ChallengeAttemptDto attemptDto,
        string challengeTitle,
        string quizSetTitle,
        CancellationToken cancellationToken = default);

    Task<byte[]> ExportLeaderboardAsync(
        ChallengeLeaderboardDto leaderboardDto,
        string challengeTitle,
        CancellationToken cancellationToken = default);

    Task<byte[]> ExportStatisticsAsync(
        ChallengeStatsDto statsDto,
        string challengeTitle,
        CancellationToken cancellationToken = default);

    Task<byte[]> ExportQuizSetAsync(Guid quizSetId, CancellationToken cancellationToken = default);
}
