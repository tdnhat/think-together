using System.Text;
using Infrastructure.Configuration;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using ThinkTogether.Domain.Aggregates.UserAggregate.Services;

namespace Api.Extensions;

public static class AuthenticationServiceCollectionExtensions
{
    public static IServiceCollection AddJwtAuthentication(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.Configure<JwtOptions>(configuration.GetSection(JwtOptions.SectionName));

        var jwtSettings = configuration.GetSection(JwtOptions.SectionName).Get<JwtOptions>()
                          ?? throw new InvalidOperationException("Cài đặt JWT chưa được cấu hình");

        var key = Encoding.UTF8.GetBytes(jwtSettings.Secret);
        var signingKey = new SymmetricSecurityKey(key);

        services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.MapInboundClaims = false;
                options.SaveToken = true;
                options.RequireHttpsMetadata = false;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtSettings.Issuer,
                    ValidAudience = jwtSettings.Audience,
                    IssuerSigningKey = signingKey,
                    ClockSkew = TimeSpan.Zero,
                    NameClaimType = "sub",
                    RoleClaimType = "role"
                };

                options.Events = new JwtBearerEvents
                {
                    OnTokenValidated = async context =>
                    {
                        var tokenBlacklistService = context.HttpContext.RequestServices
                            .GetRequiredService<ITokenBlacklistService>();

                        // Extract the jti (JWT ID) claim from the validated token
                        var jti = context.Principal?.Claims.FirstOrDefault(c => c.Type == "jti")?.Value;

                        if (!string.IsNullOrWhiteSpace(jti))
                        {
                            var isBlacklisted = await tokenBlacklistService
                                .IsTokenBlacklistedAsync(jti, context.HttpContext.RequestAborted);

                            if (isBlacklisted)
                            {
                                context.Fail("Token đã bị thu hồi.");
                            }
                        }
                    },
                    OnChallenge = context =>
                    {
                        // Skip default behavior to customize the response
                        context.HandleResponse();

                        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                        context.Response.ContentType = "application/problem+json";

                        var problemDetails = new ProblemDetails
                        {
                            Type = "https://tools.ietf.org/html/rfc7235#section-3.1",
                            Title = "Unauthorized",
                            Status = StatusCodes.Status401Unauthorized,
                            Detail = "Bạn cần đăng nhập để truy cập tài nguyên này.",
                            Instance = context.Request.Path
                        };

                        return context.Response.WriteAsJsonAsync(problemDetails);
                    }
                };
            });

        services.AddAuthorization();

        return services;
    }
}
