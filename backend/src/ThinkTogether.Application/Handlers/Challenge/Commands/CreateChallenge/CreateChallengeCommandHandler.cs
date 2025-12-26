using Mapster;
using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Services;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Repositories;
using ThinkTogether.Domain.Exceptions;
using ThinkTogether.Shared.Common;
using ChallengeEntity = ThinkTogether.Domain.Aggregates.ChallengeAggregate.Challenge;

namespace ThinkTogether.Application.Handlers.Challenge.Commands.CreateChallenge;

public sealed class CreateChallengeCommandHandler : IRequestHandler<CreateChallengeCommand, ChallengeDto>
{
    private readonly IChallengeRepository _challengeRepository;
    private readonly IQuizSetRepository _quizSetRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IChallengeValidationService _validationService;
    private readonly IShareLinkGeneratorService _shareLinkGeneratorService;
    private readonly IUnitOfWork _unitOfWork;

    public CreateChallengeCommandHandler(
        IChallengeRepository challengeRepository,
        IQuizSetRepository quizSetRepository,
        ICurrentUserService currentUserService,
        IChallengeValidationService validationService,
        IShareLinkGeneratorService shareLinkGeneratorService,
        IUnitOfWork unitOfWork)
    {
        _challengeRepository = challengeRepository;
        _quizSetRepository = quizSetRepository;
        _currentUserService = currentUserService;
        _validationService = validationService;
        _shareLinkGeneratorService = shareLinkGeneratorService;
        _unitOfWork = unitOfWork;
    }

    public async Task<ChallengeDto> Handle(
        CreateChallengeCommand request,
        CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(_currentUserService.UserId!);

        // Verify the quiz set exists
        var quizSet = await _quizSetRepository.GetByIdAsync(request.QuizSetId, cancellationToken);
        if (quizSet == null)
            throw new EntityNotFoundException("Bộ câu hỏi", request.QuizSetId);

        // Validate quiz set for challenge creation
        _validationService.ValidateQuizSetForChallenge(quizSet, userId);

        // Check if a challenge already exists
        var challengeExists = await _validationService.ChallengeExistsAsync(userId, request.QuizSetId, cancellationToken);
        if (challengeExists)
            throw new ValidationException("Bạn đã tạo một thử thách cho bộ câu hỏi này rồi. Mỗi bộ câu hỏi chỉ có thể tạo một thử thách.");

        // Generate a unique share link
        var shareLink = _shareLinkGeneratorService.GenerateShareLink();

        // Create the challenge
        var challenge = ChallengeEntity.Create(
            userId,
            request.QuizSetId,
            request.Title,
            request.Description,
            shareLink);

        challenge.SetShowLeaderboard(request.ShowLeaderboard);

        await _challengeRepository.AddAsync(challenge, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return challenge.Adapt<ChallengeDto>();
    }
}

