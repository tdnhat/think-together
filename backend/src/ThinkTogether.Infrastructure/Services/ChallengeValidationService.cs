using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Services;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate;
using ThinkTogether.Domain.Exceptions;

namespace ThinkTogether.Infrastructure.Services;

public class ChallengeValidationService : IChallengeValidationService
{
    private readonly IChallengeRepository _challengeRepository;

    public ChallengeValidationService(IChallengeRepository challengeRepository)
    {
        _challengeRepository = challengeRepository;
    }

    public void ValidateQuizSetForChallenge(QuizSet quizSet, Guid userId)
    {
        if (quizSet.CreatorId != userId)
            throw new ForbiddenException("Bạn không có quyền tạo thử thách từ bộ câu hỏi này");

        if (!quizSet.IsPublished)
            throw new ValidationException("Bộ câu hỏi phải được xuất bản trước khi tạo thử thách");

        if (!quizSet.Questions.Any())
            throw new ValidationException("Bộ câu hỏi phải có ít nhất một câu hỏi");
    }

    public async Task<bool> ChallengeExistsAsync(Guid creatorId, Guid quizSetId, CancellationToken cancellationToken = default)
    {
        var existingChallenge = await _challengeRepository.FindOneAsync(
            c => c.CreatorId == creatorId && c.QuizSetId == quizSetId && c.DeletedAt == null,
            cancellationToken);

        return existingChallenge != null;
    }
}

