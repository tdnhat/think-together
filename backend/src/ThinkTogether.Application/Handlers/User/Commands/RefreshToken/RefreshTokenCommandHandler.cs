using Application.DTOs;
using Application.Handlers.User.Commands.RefreshToken;
using Application.Services;
using Domain.Aggregates.UserAggregate.Repositories;
using Domain.Exceptions;
using MediatR;
using Shared.Common;
using ThinkTogether.Domain.Aggregates.UserAggregate.Specifications;

namespace ThinkTogether.Application.Handlers.User.Commands.RefreshToken;

public sealed class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, AuthTokenDto>
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtTokensGenerator _tokenGenerator;
    private readonly IUnitOfWork _unitOfWork;

    public RefreshTokenCommandHandler(
        IUserRepository userRepository,
        IJwtTokensGenerator tokenGenerator,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _tokenGenerator = tokenGenerator;
        _unitOfWork = unitOfWork;
    }

    public async Task<AuthTokenDto> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        var specification = new RefreshTokenSpecification(request.Token);
        var user = await _userRepository.GetBySpecAsync(specification, cancellationToken);

        if (user == null || user.IsDeleted)
            throw new UnauthorizedException("Người dùng đã bị xóa");

        if (user.Id == Guid.Empty)
            throw new UnauthorizedException("Token refresh không hợp lệ");

        var refreshToken = user.RefreshTokens.FirstOrDefault(rt => rt.Token == request.Token && rt.IsValid());

        if (refreshToken == null)
            throw new UnauthorizedException("Refresh token không hợp lệ hoặc đã hết hạn");

        var tokens = await _tokenGenerator.GenerateTokensAsync(user);

        var newRefreshTokenEntity = global::Domain.Aggregates.UserAggregate.Entities.RefreshToken.Create(user.Id,
            tokens.refreshToken, _tokenGenerator.GetRefreshTokenLifetime(false));
        user.AddRefreshToken(newRefreshTokenEntity);

        await _userRepository.UpdateAsync(user, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new AuthTokenDto(tokens.accessToken, tokens.refreshToken, tokens.accessTokenExpiresAt);
    }
}