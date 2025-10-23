using Application.Services;
using Domain.Aggregates.ChallengeAggregate.Repositories;
using Domain.Aggregates.GameSessionAggregate.Repositories;
using Domain.Aggregates.QuizSetAggregate.Repositories;
using Domain.Aggregates.UserAggregate.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Shared.Common;
using Infrastructure.Configuration;
using Infrastructure.Persistence;
using Infrastructure.Persistence.Interceptors;
using Infrastructure.Persistence.Repositories;
using Infrastructure.Persistence.UnitOfWork;
using Infrastructure.Services;

namespace Infrastructure;

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

        services.AddScoped<IPasswordHasher, BcryptPasswordHasher>();
        services.AddScoped<ITokenClaimService, TokenClaimService>();
        services.AddScoped<IJwtTokensGenerator, JwtTokensGenerator>();
        services.AddScoped<ICurrentUserService, CurrentUserService>();
    }

    private static void ConfigureInfrastructureServices(IServiceCollection services)
    {
        services.AddScoped<IDbInitializer, DbInitializer>();
    }
}
