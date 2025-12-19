using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Services;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Specifications;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Repositories;
using ThinkTogether.Domain.Enums;
using ThinkTogether.Domain.Exceptions;
using ThinkTogether.Shared.Common;

namespace ThinkTogether.Application.Handlers.GameSession.Commands.NextQuestion;

public sealed class NextQuestionCommandHandler : IRequestHandler<NextQuestionCommand, NextQuestionResult>
{
    private readonly IGameSessionRepository _gameSessionRepository;
    private readonly IQuizSetRepository _quizSetRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IQuestionTimerService _questionTimerService;
    private readonly ILeaderboardService _leaderboardService;
    private readonly IGameQuestionMappingService _questionMappingService;
    private readonly IUnitOfWork _unitOfWork;

    public NextQuestionCommandHandler(
        IGameSessionRepository gameSessionRepository,
        IQuizSetRepository quizSetRepository,
        ICurrentUserService currentUserService,
        IQuestionTimerService questionTimerService,
        ILeaderboardService leaderboardService,
        IGameQuestionMappingService questionMappingService,
        IUnitOfWork unitOfWork)
    {
        _gameSessionRepository = gameSessionRepository;
        _quizSetRepository = quizSetRepository;
        _currentUserService = currentUserService;
        _questionTimerService = questionTimerService;
        _leaderboardService = leaderboardService;
        _questionMappingService = questionMappingService;
        _unitOfWork = unitOfWork;
    }

    public async Task<NextQuestionResult> Handle(NextQuestionCommand request, CancellationToken cancellationToken)
    {
        var hostUserId = GetCurrentHostUserId();

        var spec = new GameSessionWithFullDetailsSpec(request.GameSessionId);
        var gameSession = await _gameSessionRepository.GetBySpecAsync(spec, cancellationToken)
            ?? throw new EntityNotFoundException("Phiên trò chơi", request.GameSessionId);

        gameSession.ValidateHostPermission(hostUserId);

        if (gameSession.Status != GameStatus.InProgress)
            throw new ConflictException("Trò chơi chưa bắt đầu hoặc đã kết thúc");

        await _questionTimerService.StopTimerAsync(request.GameSessionId, cancellationToken);

        var leaderboard = _leaderboardService.BuildLeaderboard(gameSession)
            .Select(e => new LeaderboardEntryDto
            {
                PlayerId = e.PlayerId,
                Nickname = e.Nickname,
                TotalPoints = e.TotalPoints,
                CorrectAnswers = e.CorrectAnswers,
                Rank = e.Rank,
                AccuracyPercentage = e.AccuracyPercentage,
                TotalTimeSpentMs = e.TotalTimeSpentMs
            })
            .ToList();

        if (!gameSession.HasMoreQuestions())
        {
            return new NextQuestionResult(
                HasMoreQuestions: false,
                Question: null,
                Leaderboard: leaderboard);
        }

        gameSession.MoveToNextQuestion();

        await _gameSessionRepository.UpdateAsync(gameSession, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var nextGameQuestion = gameSession.GetCurrentGameQuestion()
            ?? throw new InvalidOperationException("Không tìm thấy câu hỏi tiếp theo");

        var quizSet = await _quizSetRepository.GetByIdAsync(gameSession.QuizSetId, cancellationToken)
            ?? throw new EntityNotFoundException("Bộ câu hỏi", gameSession.QuizSetId);

        var question = quizSet.Questions.FirstOrDefault(q => q.Id == nextGameQuestion.QuestionId)
            ?? throw new EntityNotFoundException("Câu hỏi", nextGameQuestion.QuestionId);

        await _questionTimerService.StartTimerAsync(
            gameSession.Id,
            nextGameQuestion.Id,
            question.TimeLimit,
            cancellationToken);

        var questionDto = _questionMappingService.MapToDto(nextGameQuestion, question);

        return new NextQuestionResult(
            HasMoreQuestions: true,
            Question: questionDto,
            Leaderboard: leaderboard);
    }

    private Guid GetCurrentHostUserId()
    {
        var userIdString = _currentUserService.UserId
            ?? throw new UnauthorizedException("Người dùng chưa đăng nhập");

        if (!Guid.TryParse(userIdString, out var hostUserId))
            throw new UnauthorizedException("ID người dùng không hợp lệ");

        return hostUserId;
    }
}
