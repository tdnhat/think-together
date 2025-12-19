﻿namespace ThinkTogether.Application.Interfaces;

/// <summary>
/// Service for managing question timers in game sessions.
/// </summary>
public interface IQuestionTimerService
{
    /// <summary>
    /// Start a timer for a question.
    /// </summary>
    Task StartTimerAsync(Guid gameSessionId, Guid gameQuestionId, int durationSeconds, CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Stop the current timer for a game session.
    /// </summary>
    Task StopTimerAsync(Guid gameSessionId, CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Get the remaining time for the current question.
    /// </summary>
    Task<int?> GetRemainingTimeAsync(Guid gameSessionId, CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Check if a question timer has expired.
    /// </summary>
    Task<bool> IsTimerExpiredAsync(Guid gameSessionId, Guid gameQuestionId, CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Get the start time of the current question.
    /// </summary>
    Task<DateTime?> GetQuestionStartTimeAsync(Guid gameSessionId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get the end time of the current question.
    /// </summary>
    Task<DateTime?> GetQuestionEndTimeAsync(Guid gameSessionId, CancellationToken cancellationToken = default);
}

