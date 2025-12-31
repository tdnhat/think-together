using Infrastructure.Configuration;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using StackExchange.Redis;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.ClassAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Services;
using ThinkTogether.Domain.Aggregates.UserAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.UserAggregate.Services;
using ThinkTogether.Domain.Aggregates.CategoryAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Repositories;
using ThinkTogether.Infrastructure.Interfaces;
using ThinkTogether.Infrastructure.BackgroundTasks;
using ThinkTogether.Infrastructure.Persistence;
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

        services.AddOptions<AuthenticationOptions>()
            .Bind(configuration.GetSection(AuthenticationOptions.SectionName))
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

        services.AddOptions<CloudinaryOptions>()
            .Bind(configuration.GetSection(CloudinaryOptions.SectionName))
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
        services.AddScoped<IQuestionStatisticRepository, QuestionStatisticRepository>();
        services.AddScoped<IGameSessionRepository, GameSessionRepository>();
        services.AddScoped<IChallengeRepository, ChallengeRepository>();
        services.AddScoped<IClassRepository, ClassRepository>();
        services.AddScoped<ICategoryRepository, CategoryRepository>();

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

        // Background tasks
        services.AddSingleton<IBackgroundTaskQueue, BackgroundTaskQueue>();
        services.AddHostedService<QueuedHostedService>();

        // Domain Services - User Aggregate
        services.AddScoped<IPasswordService, PasswordService>();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IAuthenticationService, AuthenticationService>();
        services.AddScoped<ITokenBlacklistService, TokenBlacklistService>();
        services.AddScoped<IEmailService, EmailService>();
        
        // Domain Services - Challenge Aggregate
        services.AddScoped<ThinkTogether.Domain.Aggregates.ChallengeAggregate.Services.IAnswerGradingService, AnswerGradingService>();
        services.AddScoped<ThinkTogether.Domain.Aggregates.ChallengeAggregate.Services.IShareLinkGeneratorService, ShareLinkGeneratorService>();
        services.AddScoped<ThinkTogether.Domain.Aggregates.ChallengeAggregate.Services.IChallengeValidationService, ChallengeValidationService>();
        
        // Domain Services - Class Aggregate
        services.AddScoped<ThinkTogether.Domain.Aggregates.ClassAggregate.Services.IHomeworkSubmissionService, HomeworkSubmissionService>();
        
        // Gaming Services
        services.AddScoped<IPinGeneratorService, PinGeneratorService>();
        services.AddScoped<IScoreCalculatorService, ScoreCalculatorService>();
        services.AddScoped<ThinkTogether.Domain.Aggregates.GamingAggregate.Services.IGameAnswerGradingService, GameAnswerGradingService>();
        services.AddScoped<IQuestionTimerService, QuestionTimerService>();
        services.AddScoped<ILeaderboardService, LeaderboardService>();
        services.AddScoped<IGameQuestionMappingService, GameQuestionMappingService>();
        services.AddSingleton<IGameSessionStateService, RedisGameSessionStateService>();
        
        // Cloud Services
        services.AddScoped<IImageUploadService, CloudinaryService>();
        
        // PDF Export Services
        services.AddScoped<IPdfExportService, PdfExportService>();
    }
}
