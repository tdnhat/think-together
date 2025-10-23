using Domain.Aggregates.ChallengeAggregate.Repositories;
using Domain.Aggregates.GameSessionAggregate.Repositories;
using Domain.Aggregates.QuizSetAggregate.Repositories;
using Infrastructure.Configuration;
using Infrastructure.Persistence;
using Infrastructure.Persistence.Repositories;
using Infrastructure.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
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
    }

    private static void ConfigureDatabase(IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<AuditInterceptor>();

        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(
                configuration.GetConnectionString("DefaultConnection"),
                sqlServerOptionsAction => sqlServerOptionsAction.MigrationsAssembly("ThinkTogether.Infrastructure")));
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
    }

    private static void ConfigureInfrastructureServices(IServiceCollection services)
    {
        services.AddScoped<IDbInitializer, DbInitializer>();

        // Domain Services
        services.AddScoped<IPasswordService, PasswordService>();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IAuthenticationService, AuthenticationService>();
    }
}