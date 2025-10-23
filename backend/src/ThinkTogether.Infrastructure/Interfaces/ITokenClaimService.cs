using System.Security.Claims;
using Domain.Aggregates.UserAggregate;

namespace ThinkTogether.Infrastructure.Interfaces;

public interface ITokenClaimService
{
    Task<IEnumerable<Claim>> GetClaimsAsync(User user);
}
