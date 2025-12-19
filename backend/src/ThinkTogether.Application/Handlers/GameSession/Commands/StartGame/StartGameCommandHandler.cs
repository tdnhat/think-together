using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Specifications;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Repositories;
using ThinkTogether.Domain.Exceptions;
using ThinkTogether.Shared.Common;

namespace ThinkTogether.Application.Handlers.GameSession.Commands.StartGame;

public sealed class StartGameCommandHandler : IRequestHandler<StartGameCommand, GameQuestionDto>
{
    private readonly IGameSessionRepository _gameSessionRepository;
    private readonly IQuizSetRepository _quizSetRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IQuestionTimerService _questionTimerService;
    private readonly IGameQuestionMappingService _questionMappingService;
    private readonly IUnitOfWork _unitOfWork;

    public StartGameCommandHandler(
        IGameSessionRepository gameSessionRepository,
        IQuizSetRepository quizSetRepository,
        ICurrentUserService currentUserService,
        IQuestionTimerService questionTimerService,
        IGameQuestionMappingService questionMappingService,
        IUnitOfWork unitOfWork)
    {
        _gameSessionRepository = gameSessionRepository;
        _quizSetRepository = quizSetRepository;
        _currentUserService = currentUserService;
        _questionTimerService = questionTimerService;
        _questionMappingService = questionMappingService;
        _unitOfWork = unitOfWork;
    }

    public async Task<GameQuestionDto> Handle(StartGameCommand request, CancellationToken cancellationToken)
    {
        var hostUserId = GetCurrentHostUserId();

        var spec = new GameSessionWithFullDetailsSpec(request.GameSessionId);
        var gameSession = await _gameSessionRepository.GetBySpecAsync(spec, cancellationToken)
            ?? throw new EntityNotFoundException("Phiên trò chơi", request.GameSessionId);

        gameSession.ValidateHostPermission(hostUserId);
        gameSession.InitializeScores(gameSession.GameQuestions.Count);
        gameSession.Start();

        await _gameSessionRepository.UpdateAsync(gameSession, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var firstGameQuestion = gameSession.GetCurrentGameQuestion()
            ?? throw new InvalidOperationException("Không tìm thấy câu hỏi đầu tiên");

        var quizSet = await _quizSetRepository.GetByIdAsync(gameSession.QuizSetId, cancellationToken)
            ?? throw new EntityNotFoundException("Bộ câu hỏi", gameSession.QuizSetId);

        var question = quizSet.Questions.FirstOrDefault(q => q.Id == firstGameQuestion.QuestionId)
            ?? throw new EntityNotFoundException("Câu hỏi", firstGameQuestion.QuestionId);

        await _questionTimerService.StartTimerAsync(
            gameSession.Id,
            firstGameQuestion.Id,
            question.TimeLimit,
            cancellationToken);

        return _questionMappingService.MapToDto(firstGameQuestion, question);
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
