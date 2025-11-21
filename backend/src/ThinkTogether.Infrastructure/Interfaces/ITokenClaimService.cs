using System.Security.Claims;
using Domain.Aggregates.UserAggregate;
using ThinkTogether.Domain.Aggregates.UserAggregate;

namespace ThinkTogether.Infrastructure.Interfaces;

public interface ITokenClaimService
{
    Task<IEnumerable<Claim>> GetClaimsAsync(User user);
}
