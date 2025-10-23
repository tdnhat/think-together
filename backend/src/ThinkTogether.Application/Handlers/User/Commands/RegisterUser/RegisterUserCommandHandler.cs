using Application.DTOs;
using Application.Handlers.User.Commands.RegisterUser;
using Application.Services;
using Domain.Aggregates.UserAggregate.Repositories;
using Domain.Aggregates.UserAggregate.ValueObjects;
using Domain.Exceptions;
using MediatR;
using Shared.Common;

namespace ThinkTogether.Application.Handlers.User.Commands.RegisterUser;

public sealed class RegisterUserCommandHandler : IRequestHandler<RegisterUserCommand, AuthTokenDto>
{
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokensGenerator _tokensGenerator;

    public RegisterUserCommandHandler(
        IUserRepository userRepository,
        IUnitOfWork unitOfWork,
        IPasswordHasher passwordHasher,
        IJwtTokensGenerator tokensGenerator)
    {
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
        _passwordHasher = passwordHasher;
        _tokensGenerator = tokensGenerator;
    }

    public async Task<AuthTokenDto> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
    {
        var email = Email.Create(request.Email);
        var existingUser = await _userRepository.GetByEmailAsync(email, cancellationToken);

        if (existingUser != null)
            throw new ConflictException("Email đã được đăng ký");

        var passwordHash = _passwordHasher.Hash(request.Password);

        var user = global::Domain.Aggregates.UserAggregate.User.Create(
            email,
            request.FirstName,
            request.LastName,
            Password.CreateFromHash(passwordHash));

        await _userRepository.AddAsync(user, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var (accessToken, refreshToken, expiresAt) = await _tokensGenerator.GenerateTokensAsync(user);

        var refreshTokenEntity = global::Domain.Aggregates.UserAggregate.Entities.RefreshToken.Create(user.Id, refreshToken,
            _tokensGenerator.GetRefreshTokenLifetime(false));
        user.AddRefreshToken(refreshTokenEntity);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new AuthTokenDto(accessToken, refreshToken, expiresAt);
    }
}