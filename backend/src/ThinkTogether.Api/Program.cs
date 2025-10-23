using Api.Extensions;
using Application;
using Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddApiServices();
builder.Services.AddSwaggerDocumentation();
builder.Services.AddJwtAuthentication(builder.Configuration);
builder.Services.AddCorsConfiguration();

var app = builder.Build();

// Initialize database
await app.InitializeDatabaseAsync();

// Configure middleware pipeline
app.ConfigurePipeline();

await app.RunAsync();

