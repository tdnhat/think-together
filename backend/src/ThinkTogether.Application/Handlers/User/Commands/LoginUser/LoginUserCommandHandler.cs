using Application.DTOs;
using Application.Handlers.User.Commands.LoginUser;
using Application.Services;
using Domain.Aggregates.UserAggregate.Repositories;
using Domain.Aggregates.UserAggregate.ValueObjects;
using Domain.Exceptions;
using MediatR;
using Shared.Common;

namespace ThinkTogether.Application.Handlers.User.Commands.LoginUser;

public sealed class LoginUserCommandHandler : IRequestHandler<LoginUserCommand, AuthTokenDto>
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokensGenerator _tokensGenerator;
    private readonly IUnitOfWork _unitOfWork;

    public LoginUserCommandHandler(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        IJwtTokensGenerator tokensGenerator,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _tokensGenerator = tokensGenerator;
        _unitOfWork = unitOfWork;
    }

    public async Task<AuthTokenDto> Handle(LoginUserCommand request, CancellationToken cancellationToken)
    {
        var email = Email.Create(request.Email);
        var user = await _userRepository.GetByEmailAsync(email, cancellationToken);

        if (user == null || user.IsDeleted)
            throw new UnauthorizedException("Email hoặc mật khẩu không hợp lệ");

        var isPasswordValid = _passwordHasher.Verify(request.Password, user.PasswordHash.HashedValue);

        if (!isPasswordValid)
            throw new UnauthorizedException("Email hoặc mật khẩu không hợp lệ");

        var (accessToken, refreshToken, expiresAt) = await _tokensGenerator.GenerateTokensAsync(user);

        var refreshTokenEntity = global::Domain.Aggregates.UserAggregate.Entities.RefreshToken.Create(user.Id, refreshToken, _tokensGenerator.GetRefreshTokenLifetime(false));
        user.AddRefreshToken(refreshTokenEntity);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new AuthTokenDto(accessToken, refreshToken, expiresAt);
    }
}
