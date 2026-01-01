using Mapster;
using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Domain.Aggregates.UserAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.UserAggregate.Specifications;
using ThinkTogether.Shared.Common;

namespace ThinkTogether.Application.Handlers.User.Queries.GetUsers;

public sealed class GetUsersQueryHandler : IRequestHandler<GetUsersQuery, PaginatedResponse<UserDto>>
{
    private readonly IUserRepository _userRepository;

    public GetUsersQueryHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<PaginatedResponse<UserDto>> Handle(
        GetUsersQuery request,
        CancellationToken cancellationToken)
    {
        var spec = new UsersWithFiltersSpecification(
            request.Search,
            request.Role,
            request.SortBy,
            request.Page,
            request.PageSize);

        var (users, total) = await _userRepository.GetBySpecificationAsync(spec, cancellationToken);
        var dtos = users.Adapt<List<UserDto>>();

        return new PaginatedResponse<UserDto>
        {
            Data = dtos,
            Total = total,
            Page = request.Page,
            PageSize = request.PageSize,
        };
    }
}
