using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Domain.Enums;

namespace ThinkTogether.Application.Handlers.GameSession.Queries.SyncGameSession;

public sealed record SyncGameSessionQuery(Guid GameSessionId, Guid? PlayerId = null) : IRequest<SyncGameSessionResult>;

public sealed record SyncGameSessionResult(
    GameSessionSyncStatus Status,
    SyncCurrentQuestionDto? CurrentQuestion,
    List<SyncPlayerDto> Players,
    bool IsHost,
    int CurrentQuestionIndex,
    int TotalQuestions);

public sealed record SyncCurrentQuestionDto(
    Guid Id,
    Guid GameQuestionId,
    string Content,
    string QuestionType,
    DateTime EndTime, // Absolute UTC end time for time synchronization
    int TotalTimeSeconds,
    int PositionInGame,
    string? VideoUrl,
    int? VideoTimestamp,
    List<SyncQuestionOptionDto> Options);

public sealed record SyncQuestionOptionDto(
    int Index,
    string Content,
    string? ImageUrl);

public sealed record SyncPlayerDto(
    Guid Id,
    string Nickname,
    int Score);
