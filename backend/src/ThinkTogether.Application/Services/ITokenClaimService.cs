using System.Security.Claims;
using Domain.Aggregates.UserAggregate;

namespace Application.Services;

public interface ITokenClaimService
{
    Task<IEnumerable<Claim>> GetClaimsAsync(User user);
}

