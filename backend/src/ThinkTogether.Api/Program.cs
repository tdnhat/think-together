using Api.Extensions;
using Application;
using Infrastructure;
using ThinkTogether.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddApplication(builder.Configuration);
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddApiServices();
builder.Services.AddSwaggerDocumentation();
builder.Services.AddJwtAuthentication(builder.Configuration);
builder.Services.AddCorsConfiguration();
builder.Services.AddSignalRServices();

var app = builder.Build();

// Initialize database
await app.InitializeDatabaseAsync();

// Configure middleware pipeline
app.ConfigurePipeline();

// Map SignalR hubs
app.MapSignalRHubs();

await app.RunAsync();

