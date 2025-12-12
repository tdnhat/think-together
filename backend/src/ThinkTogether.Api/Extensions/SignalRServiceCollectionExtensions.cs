using ThinkTogether.Api.Hubs;
using ThinkTogether.Api.Services;
using ThinkTogether.Application.Interfaces;

namespace Api.Extensions;

public static class SignalRServiceCollectionExtensions
{
    public static IServiceCollection AddSignalRServices(this IServiceCollection services)
    {
        services.AddSignalR()
            .AddMessagePackProtocol();

        services.AddScoped<IGameSessionNotificationService, GameSessionNotificationService>();

        return services;
    }

    public static WebApplication MapSignalRHubs(this WebApplication app)
    {
        app.MapHub<GameHub>("/hubs/game");

        return app;
    }
}

