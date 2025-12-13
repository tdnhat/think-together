using Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Repositories;

namespace ThinkTogether.Infrastructure.Persistence.Repositories;

public class ChallengeRepository : Repository<Challenge, Guid>, IChallengeRepository
{
    public ChallengeRepository(ApplicationDbContext context) : base(context)
    {
    }
}
