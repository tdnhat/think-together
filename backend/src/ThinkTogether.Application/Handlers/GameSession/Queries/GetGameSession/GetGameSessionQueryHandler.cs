using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Specifications;
using ThinkTogether.Domain.Enums;
using ThinkTogether.Domain.Exceptions;

namespace ThinkTogether.Application.Handlers.GameSession.Queries.GetGameSession;

public sealed class GetGameSessionQueryHandler : IRequestHandler<GetGameSessionQuery, GameSessionDto>
{
    private readonly IGameSessionRepository _gameSessionRepository;
    private readonly IQuizSetRepository _quizSetRepository;
    private readonly IGameQuestionMappingService _questionMappingService;

    public GetGameSessionQueryHandler(
        IGameSessionRepository gameSessionRepository,
        IQuizSetRepository quizSetRepository,
        IGameQuestionMappingService questionMappingService)
    {
        _gameSessionRepository = gameSessionRepository;
        _quizSetRepository = quizSetRepository;
        _questionMappingService = questionMappingService;
    }

    public async Task<GameSessionDto> Handle(GetGameSessionQuery request, CancellationToken cancellationToken)
    {
        var spec = new GameSessionWithFullDetailsSpec(request.GameSessionId);
        var gameSession = await _gameSessionRepository.GetBySpecAsync(spec, cancellationToken)
            ?? throw new EntityNotFoundException("Phiên trò chơi", request.GameSessionId);

        GameQuestionDto? currentQuestionDto = null;

        if (gameSession.Status == GameStatus.InProgress)
        {
            var currentGameQuestion = gameSession.GetCurrentGameQuestion();
            if (currentGameQuestion != null)
            {
                var quizSet = await _quizSetRepository.GetByIdAsync(gameSession.QuizSetId, cancellationToken);
                var question = quizSet?.Questions.FirstOrDefault(q => q.Id == currentGameQuestion.QuestionId);

                if (question != null)
                {
                    currentQuestionDto = _questionMappingService.MapToDto(currentGameQuestion, question);
                }
            }
        }

        return new GameSessionDto
        {
            Id = gameSession.Id,
            HostUserId = gameSession.HostUserId,
            QuizSetId = gameSession.QuizSetId,
            PIN = gameSession.PIN,
            Status = gameSession.Status,
            CurrentQuestionIndex = gameSession.CurrentQuestionIndex,
            TotalQuestions = gameSession.GameQuestions.Count,
            CurrentQuestion = currentQuestionDto,
            StartedAt = gameSession.StartedAt,
            EndedAt = gameSession.EndedAt,
            Players = gameSession.Players.Select(p =>
            {
                var score = gameSession.Scores.FirstOrDefault(s => s.GamePlayerId == p.Id);
                return new GamePlayerDto
                {
                    Id = p.Id,
                    Nickname = p.Nickname,
                    ConnectionStatus = p.ConnectionStatus,
                    TotalPoints = score?.TotalPoints ?? 0,
                    Rank = score?.FinalRank
                };
            }).ToList()
        };
    }
}
