﻿namespace ThinkTogether.Application.Interfaces;

public interface IQuestionTimerService
{
    Task StartTimerAsync(Guid gameSessionId, Guid gameQuestionId, int durationSeconds, CancellationToken cancellationToken = default);
    
    Task StopTimerAsync(Guid gameSessionId, CancellationToken cancellationToken = default);
    
    Task<int?> GetRemainingTimeAsync(Guid gameSessionId, CancellationToken cancellationToken = default);
    
    Task<bool> IsTimerExpiredAsync(Guid gameSessionId, Guid gameQuestionId, CancellationToken cancellationToken = default);
    
    Task<DateTime?> GetQuestionStartTimeAsync(Guid gameSessionId, CancellationToken cancellationToken = default);

    Task<DateTime?> GetQuestionEndTimeAsync(Guid gameSessionId, CancellationToken cancellationToken = default);
}

