using Domain.Aggregates.ChallengeAggregate.Repositories;
using Domain.Aggregates.GameSessionAggregate.Repositories;
using Domain.Aggregates.QuizSetAggregate.Repositories;
using Infrastructure.Configuration;
using Infrastructure.Persistence;
using Infrastructure.Persistence.Repositories;
using Infrastructure.Services;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using StackExchange.Redis;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.UserAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.UserAggregate.Services;
using ThinkTogether.Infrastructure.Interfaces;
using ThinkTogether.Infrastructure.Persistence.Interceptors;
using ThinkTogether.Infrastructure.Persistence.Repositories;
using ThinkTogether.Infrastructure.Persistence.UnitOfWork;
using ThinkTogether.Infrastructure.Services;
using ThinkTogether.Shared.Common;

namespace ThinkTogether.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        ConfigureOptions(services, configuration);
        ConfigureRedis(services, configuration);
        ConfigureDatabase(services, configuration);
        ConfigureRepositories(services);
        ConfigureApplicationServices(services);
        ConfigureInfrastructureServices(services);

        return services;
    }

    private static void ConfigureOptions(IServiceCollection services, IConfiguration configuration)
    {
        services.AddOptions<JwtOptions>()
            .Bind(configuration.GetSection(JwtOptions.SectionName))
            .ValidateDataAnnotations()
            .ValidateOnStart();

        services.AddOptions<AdminSeedOptions>()
            .Bind(configuration.GetSection(AdminSeedOptions.SectionName))
            .ValidateDataAnnotations()
            .ValidateOnStart();

        services.AddOptions<RedisOptions>()
            .Bind(configuration.GetSection(RedisOptions.SectionName))
            .ValidateDataAnnotations()
            .ValidateOnStart();

        services.AddOptions<EmailOptions>()
            .Bind(configuration.GetSection(EmailOptions.SectionName))
            .ValidateDataAnnotations()
            .ValidateOnStart();
    }

    private static void ConfigureRedis(IServiceCollection services, IConfiguration configuration)
    {
        var redisOptions = configuration.GetSection(RedisOptions.SectionName).Get<RedisOptions>();
        if (redisOptions == null || string.IsNullOrWhiteSpace(redisOptions.ConnectionString))
        {
            throw new InvalidOperationException("Cấu hình Redis không hợp lệ.");
        }

        services.AddSingleton<IConnectionMultiplexer>(sp =>
        {
            var configurationOptions = ConfigurationOptions.Parse(redisOptions.ConnectionString);
            return ConnectionMultiplexer.Connect(configurationOptions);
        });
    }

    private static void ConfigureDatabase(IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<AuditInterceptor>();
        services.AddScoped<DispatchDomainEventInterceptor>();

        services.AddDbContext<ApplicationDbContext>(
            (serviceProvider, options) =>
            {
                options.UseSqlServer(
                    configuration.GetConnectionString("DefaultConnection"),
                    sqlServerOptionsAction => sqlServerOptionsAction.MigrationsAssembly("ThinkTogether.Infrastructure"));
                
                // Get the dispatcher interceptor from DI container
                var dispatchDomainEventInterceptor = serviceProvider.GetRequiredService<DispatchDomainEventInterceptor>();
                options.AddInterceptors(dispatchDomainEventInterceptor);
            });
    }

    private static void ConfigureRepositories(IServiceCollection services)
    {
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IQuizSetRepository, QuizSetRepository>();
        services.AddScoped<IGameSessionRepository, GameSessionRepository>();
        services.AddScoped<IChallengeRepository, ChallengeRepository>();

        services.AddScoped<IUnitOfWork, UnitOfWork>();
    }

    private static void ConfigureApplicationServices(IServiceCollection services)
    {
        services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

        services.AddScoped<ITokenClaimService, TokenClaimService>();
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddScoped<IJwtContext, CurrentUserService>();
    }

    private static void ConfigureInfrastructureServices(IServiceCollection services)
    {
        services.AddScoped<IDbInitializer, DbInitializer>();

        // Domain Services
        services.AddScoped<IPasswordService, PasswordService>();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IAuthenticationService, AuthenticationService>();
        services.AddScoped<ITokenBlacklistService, TokenBlacklistService>();
        services.AddScoped<IEmailService, EmailService>();
    }
}