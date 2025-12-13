using MediatR;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Specifications;
using ThinkTogether.Domain.Exceptions;
using ThinkTogether.Shared.Common;

namespace ThinkTogether.Application.Handlers.Challenge.Commands.FlagQuestion;

public sealed class FlagQuestionCommandHandler : IRequestHandler<FlagQuestionCommand, Unit>
{
    private readonly IChallengeRepository _challengeRepository;
    private readonly IUnitOfWork _unitOfWork;

    public FlagQuestionCommandHandler(
        IChallengeRepository challengeRepository,
        IUnitOfWork unitOfWork)
    {
        _challengeRepository = challengeRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Unit> Handle(FlagQuestionCommand request, CancellationToken cancellationToken)
    {
        var spec = new ChallengeByAttemptIdSpec(request.AttemptId);
        var challenge = await _challengeRepository.GetBySpecAsync(spec, cancellationToken)
            ?? throw new EntityNotFoundException("Thử thách", request.AttemptId);

        var attempt = challenge.Attempts.FirstOrDefault(a => a.Id == request.AttemptId)
            ?? throw new EntityNotFoundException("Lượt chơi", request.AttemptId);

        if (request.IsFlagged)
        {
            attempt.FlagQuestion(request.QuestionId);
        }
        else
        {
            attempt.UnflagQuestion(request.QuestionId);
        }

        await _challengeRepository.UpdateAsync(challenge, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
