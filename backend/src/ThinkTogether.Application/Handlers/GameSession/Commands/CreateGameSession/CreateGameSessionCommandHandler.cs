using MediatR;
using ThinkTogether.Application.Common;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Entities;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Services;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Specifications;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Repositories;
using ThinkTogether.Domain.Exceptions;
using ThinkTogether.Shared.Common;

namespace ThinkTogether.Application.Handlers.GameSession.Commands.CreateGameSession;

public sealed class CreateGameSessionCommandHandler : BaseHandler, IRequestHandler<CreateGameSessionCommand, GameSessionDto>
{
    private readonly IGameSessionRepository _gameSessionRepository;
    private readonly IQuizSetRepository _quizSetRepository;
    private readonly IPinGeneratorService _pinGeneratorService;
    private readonly IUnitOfWork _unitOfWork;

    public CreateGameSessionCommandHandler(
        IGameSessionRepository gameSessionRepository,
        IQuizSetRepository quizSetRepository,
        IPinGeneratorService pinGeneratorService,
        ICurrentUserService currentUserService,
        IUnitOfWork unitOfWork)
        : base(currentUserService)
    {
        _gameSessionRepository = gameSessionRepository;
        _quizSetRepository = quizSetRepository;
        _pinGeneratorService = pinGeneratorService;
        _unitOfWork = unitOfWork;
    }

    public async Task<GameSessionDto> Handle(CreateGameSessionCommand request, CancellationToken cancellationToken)
    {
        var hostUserId = GetCurrentHostUserId();

        var quizSet = await _quizSetRepository.GetByIdAsync(request.QuizSetId, cancellationToken)
            ?? throw new EntityNotFoundException("Bộ câu hỏi", request.QuizSetId);

        // var existingSessionSpec = new ActiveGameSessionByHostSpec(hostUserId);
        // var existingSession = await _gameSessionRepository.GetBySpecAsync(existingSessionSpec, cancellationToken);
        // if (existingSession != null)
        //     throw new ConflictException("Bạn đã có một phiên trò chơi đang hoạt động");

        var pin = await _pinGeneratorService.GenerateUniquePinAsync(cancellationToken);

        var gameSession = Domain.Aggregates.GamingAggregate.GameSession.Create(hostUserId, request.QuizSetId, pin);

        var questions = quizSet.Questions.OrderBy(q => q.DisplayOrder).ToList();
        for (int i = 0; i < questions.Count; i++)
        {
            var gameQuestion = GameQuestion.Create(gameSession.Id, questions[i].Id, i);
            gameSession.AddGameQuestion(gameQuestion);
        }

        await _gameSessionRepository.AddAsync(gameSession, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new GameSessionDto
        {
            Id = gameSession.Id,
            HostUserId = gameSession.HostUserId,
            QuizSetId = gameSession.QuizSetId,
            PIN = gameSession.PIN,
            Status = gameSession.Status,
            CurrentQuestionIndex = gameSession.CurrentQuestionIndex,
            TotalQuestions = gameSession.GameQuestions.Count,
            StartedAt = gameSession.StartedAt,
            EndedAt = gameSession.EndedAt,
            Players = new List<GamePlayerDto>()
        };
    }
}
