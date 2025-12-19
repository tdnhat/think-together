﻿using Microsoft.Extensions.Logging;
using StackExchange.Redis;
using ThinkTogether.Application.Interfaces;

namespace ThinkTogether.Infrastructure.Services;

/// <summary>
/// Redis-based implementation of question timer service.
/// </summary>
public class QuestionTimerService : IQuestionTimerService
{
    private readonly IConnectionMultiplexer _redis;
    private readonly ILogger<QuestionTimerService> _logger;
    private const string KeyPrefix = "timer:";

    public QuestionTimerService(
        IConnectionMultiplexer redis,
        ILogger<QuestionTimerService> logger)
    {
        _redis = redis;
        _logger = logger;
    }

    private IDatabase GetDatabase() => _redis.GetDatabase();

    public async Task StartTimerAsync(Guid gameSessionId, Guid gameQuestionId, int durationSeconds, CancellationToken cancellationToken = default)
    {
        var db = GetDatabase();
        var key = GetTimerKey(gameSessionId);
        var startTime = DateTime.UtcNow;
        var endTime = startTime.AddSeconds(durationSeconds);

        var timerData = new TimerData
        {
            GameQuestionId = gameQuestionId,
            StartTime = startTime,
            EndTime = endTime,
            DurationSeconds = durationSeconds
        };

        var json = System.Text.Json.JsonSerializer.Serialize(timerData);
        await db.StringSetAsync(key, json, TimeSpan.FromSeconds(durationSeconds + 60)); // Extra 60s for cleanup buffer

        _logger.LogInformation("Started timer for game {GameSessionId}, question {QuestionId}, duration {Duration}s",
            gameSessionId, gameQuestionId, durationSeconds);
    }

    public async Task StopTimerAsync(Guid gameSessionId, CancellationToken cancellationToken = default)
    {
        var db = GetDatabase();
        var key = GetTimerKey(gameSessionId);
        await db.KeyDeleteAsync(key);

        _logger.LogInformation("Stopped timer for game {GameSessionId}", gameSessionId);
    }

    public async Task<int?> GetRemainingTimeAsync(Guid gameSessionId, CancellationToken cancellationToken = default)
    {
        var db = GetDatabase();
        var key = GetTimerKey(gameSessionId);
        var json = await db.StringGetAsync(key);

        if (!json.HasValue)
            return null;

        var timerData = System.Text.Json.JsonSerializer.Deserialize<TimerData>(json.ToString());
        if (timerData == null)
            return null;

        var remaining = (int)(timerData.EndTime - DateTime.UtcNow).TotalSeconds;
        return Math.Max(0, remaining);
    }

    public async Task<bool> IsTimerExpiredAsync(Guid gameSessionId, Guid gameQuestionId, CancellationToken cancellationToken = default)
    {
        var db = GetDatabase();
        var key = GetTimerKey(gameSessionId);
        var json = await db.StringGetAsync(key);

        if (!json.HasValue)
            return true; // No timer means expired

        var timerData = System.Text.Json.JsonSerializer.Deserialize<TimerData>(json.ToString());
        if (timerData == null || timerData.GameQuestionId != gameQuestionId)
            return true;

        return DateTime.UtcNow >= timerData.EndTime;
    }

    public async Task<DateTime?> GetQuestionStartTimeAsync(Guid gameSessionId, CancellationToken cancellationToken = default)
    {
        var db = GetDatabase();
        var key = GetTimerKey(gameSessionId);
        var json = await db.StringGetAsync(key);

        if (!json.HasValue)
            return null;

        var timerData = System.Text.Json.JsonSerializer.Deserialize<TimerData>(json.ToString());
        return timerData?.StartTime;
    }

    public async Task<DateTime?> GetQuestionEndTimeAsync(Guid gameSessionId, CancellationToken cancellationToken = default)
    {
        var db = GetDatabase();
        var key = GetTimerKey(gameSessionId);
        var json = await db.StringGetAsync(key);

        if (!json.HasValue)
            return null;

        var timerData = System.Text.Json.JsonSerializer.Deserialize<TimerData>(json.ToString());
        return timerData?.EndTime;
    }

    private static string GetTimerKey(Guid gameSessionId) => $"{KeyPrefix}{gameSessionId}";

    private class TimerData
    {
        public Guid GameQuestionId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int DurationSeconds { get; set; }
    }
}

