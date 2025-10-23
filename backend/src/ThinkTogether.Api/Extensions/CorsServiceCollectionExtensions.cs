using Microsoft.Extensions.DependencyInjection;

namespace Api.Extensions;

public static class CorsServiceCollectionExtensions
{
    public static IServiceCollection AddCorsConfiguration(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddDefaultPolicy(policy =>
            {
                policy.WithOrigins("http://localhost:3000", "http://localhost:3001")
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials();
            });
        });

        return services;
    }
}
