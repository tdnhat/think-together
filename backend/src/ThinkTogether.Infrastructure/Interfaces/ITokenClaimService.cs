using System.Security.Claims;
using ThinkTogether.Domain.Aggregates.UserAggregate;

namespace ThinkTogether.Infrastructure.Interfaces;

public interface ITokenClaimService
{
    Task<IEnumerable<Claim>> GetClaimsAsync(User user);
}
