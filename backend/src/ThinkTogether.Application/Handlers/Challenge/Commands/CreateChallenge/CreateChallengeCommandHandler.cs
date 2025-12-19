using Mapster;
using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Repositories;
using ThinkTogether.Domain.Exceptions;
using ChallengeEntity = ThinkTogether.Domain.Aggregates.ChallengeAggregate.Challenge;

namespace ThinkTogether.Application.Handlers.Challenge.Commands.CreateChallenge;

public sealed class CreateChallengeCommandHandler : IRequestHandler<CreateChallengeCommand, ChallengeDto>
{
    private readonly IChallengeRepository _challengeRepository;
    private readonly IQuizSetRepository _quizSetRepository;
    private readonly ICurrentUserService _currentUserService;

    public CreateChallengeCommandHandler(
        IChallengeRepository challengeRepository,
        IQuizSetRepository quizSetRepository,
        ICurrentUserService currentUserService)
    {
        _challengeRepository = challengeRepository;
        _quizSetRepository = quizSetRepository;
        _currentUserService = currentUserService;
    }

    public async Task<ChallengeDto> Handle(
        CreateChallengeCommand request,
        CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(_currentUserService.UserId!);

        // Verify the quiz set exists and belongs to the user
        var quizSet = await _quizSetRepository.GetByIdAsync(request.QuizSetId, cancellationToken);
        
        if (quizSet == null)
            throw new EntityNotFoundException("Bộ câu hỏi", request.QuizSetId);

        if (quizSet.CreatorId != userId)
            throw new ForbiddenException("Bạn không có quyền tạo thử thách từ bộ câu hỏi này");

        if (!quizSet.IsPublished)
            throw new ValidationException("Bộ câu hỏi phải được xuất bản trước khi tạo thử thách");

        if (!quizSet.Questions.Any())
            throw new ValidationException("Bộ câu hỏi phải có ít nhất một câu hỏi");

        // Check if a challenge already exists for this creator and quiz set
        var existingChallenge = await _challengeRepository.FindOneAsync(
            c => c.CreatorId == userId && c.QuizSetId == request.QuizSetId && c.DeletedAt == null,
            cancellationToken);

        if (existingChallenge != null)
            throw new ValidationException("Bạn đã tạo một thử thách cho bộ câu hỏi này rồi. Mỗi bộ câu hỏi chỉ có thể tạo một thử thách.");

        // Generate a unique share link
        var shareLink = GenerateShareLink();

        // Create the challenge
        var challenge = ChallengeEntity.Create(
            userId,
            request.QuizSetId,
            request.Title,
            request.Description,
            shareLink);

        challenge.SetShowLeaderboard(request.ShowLeaderboard);

        await _challengeRepository.AddAsync(challenge, cancellationToken);
        await _challengeRepository.SaveChangesAsync(cancellationToken);

        return challenge.Adapt<ChallengeDto>();
    }

    private string GenerateShareLink()
    {
        // Generate a short unique code for the share link
        // Using 8 characters of a GUID for simplicity
        return Guid.NewGuid().ToString("N")[..8];
    }
}

