using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Entities;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Services;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Specifications;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Repositories;
using ThinkTogether.Domain.Enums;
using ThinkTogether.Domain.Exceptions;
using ThinkTogether.Shared.Common;

namespace ThinkTogether.Application.Handlers.GameSession.Commands.SubmitAnswer;

public sealed class SubmitAnswerCommandHandler : IRequestHandler<SubmitAnswerCommand, AnswerResultDto>
{
    private readonly IGameSessionRepository _gameSessionRepository;
    private readonly IQuizSetRepository _quizSetRepository;
    private readonly IGameAnswerGradingService _answerGradingService;
    private readonly IScoreCalculatorService _scoreCalculatorService;
    private readonly IQuestionTimerService _questionTimerService;
    private readonly IUnitOfWork _unitOfWork;

    public SubmitAnswerCommandHandler(
        IGameSessionRepository gameSessionRepository,
        IQuizSetRepository quizSetRepository,
        IGameAnswerGradingService answerGradingService,
        IScoreCalculatorService scoreCalculatorService,
        IQuestionTimerService questionTimerService,
        IUnitOfWork unitOfWork)
    {
        _gameSessionRepository = gameSessionRepository;
        _quizSetRepository = quizSetRepository;
        _answerGradingService = answerGradingService;
        _scoreCalculatorService = scoreCalculatorService;
        _questionTimerService = questionTimerService;
        _unitOfWork = unitOfWork;
    }

    public async Task<AnswerResultDto> Handle(SubmitAnswerCommand request, CancellationToken cancellationToken)
    {
        var spec = new GameSessionWithFullDetailsSpec(request.GameSessionId);
        var gameSession = await _gameSessionRepository.GetBySpecAsync(spec, cancellationToken)
            ?? throw new EntityNotFoundException("Phiên trò chơi", request.GameSessionId);

        if (gameSession.Status != GameStatus.InProgress)
            throw new ConflictException("Trò chơi chưa bắt đầu hoặc đã kết thúc");

        var isExpired = await _questionTimerService.IsTimerExpiredAsync(
            request.GameSessionId,
            request.GameQuestionId,
            cancellationToken);

        if (isExpired)
            throw new ConflictException("Thời gian trả lời đã hết");

        var player = gameSession.GetPlayer(request.PlayerId)
            ?? throw new EntityNotFoundException("Người chơi", request.PlayerId);

        if (player.HasAnswered(request.GameQuestionId))
            throw new ConflictException("Bạn đã trả lời câu hỏi này rồi");

        var gameQuestion = gameSession.GameQuestions.FirstOrDefault(gq => gq.Id == request.GameQuestionId)
            ?? throw new EntityNotFoundException("Câu hỏi trò chơi", request.GameQuestionId);

        var quizSet = await _quizSetRepository.GetByIdAsync(gameSession.QuizSetId, cancellationToken)
            ?? throw new EntityNotFoundException("Bộ câu hỏi", gameSession.QuizSetId);

        var question = quizSet.Questions.FirstOrDefault(q => q.Id == gameQuestion.QuestionId)
            ?? throw new EntityNotFoundException("Câu hỏi", gameQuestion.QuestionId);

        // Use domain service to determine if answer is correct
        var isCorrect = _answerGradingService.IsAnswerCorrect(question, request.SelectedOptionIndexes);

        var timeLimitMs = question.TimeLimit * 1000;
        var pointsEarned = _scoreCalculatorService.CalculatePoints(isCorrect, request.ResponseTimeMs, timeLimitMs);

        var playerAnswer = PlayerAnswer.Create(
            request.GameSessionId,
            request.PlayerId,
            request.GameQuestionId,
            isCorrect,
            request.ResponseTimeMs,
            pointsEarned);

        player.AddAnswer(playerAnswer);
        gameQuestion.RecordAnswer(isCorrect, request.ResponseTimeMs);

        var playerScore = gameSession.GetPlayerScore(request.PlayerId);
        if (playerScore != null)
        {
            playerScore.AddPoints(pointsEarned);
            if (isCorrect)
                playerScore.RecordCorrectAnswer();
        }

        await _gameSessionRepository.UpdateAsync(gameSession, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var currentRank = gameSession.Scores
            .OrderByDescending(s => s.TotalPoints)
            .ThenByDescending(s => s.CorrectAnswers)
            .ToList()
            .FindIndex(s => s.GamePlayerId == request.PlayerId) + 1;

        return new AnswerResultDto
        {
            IsCorrect = isCorrect,
            PointsEarned = pointsEarned,
            TotalPoints = playerScore?.TotalPoints ?? pointsEarned,
            CurrentRank = currentRank,
            ResponseTimeMs = request.ResponseTimeMs
        };
    }
}
