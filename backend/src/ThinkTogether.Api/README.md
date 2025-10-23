# ThinkTogether API

This is the main API project for the ThinkTogether application, built with ASP.NET Core 9.0.

## Features

- RESTful API for quiz management and user authentication
- JWT-based authentication
- Auto-applied database migrations
- Admin account seeding
- Swagger/OpenAPI documentation

## Running the Application

### Prerequisites

- .NET 9.0 SDK
- SQL Server (local or remote)

### Configuration

The application uses `appsettings.json` for configuration. Key settings include:

- **Database**: Connection string in `ConnectionStrings.DefaultConnection`
- **JWT**: Token settings in `JwtSettings`
- **Admin Seeding**: Admin account configuration in `AdminSeed`

### Launch Profiles

Available via Visual Studio or `dotnet run`:

- **ThinkTogether.Api**: Runs on `http://localhost:5000` (Development)
- **IIS Express**: Uses IIS Express on `http://localhost:5001`

### Database Setup

The application automatically:
1. Applies EF Core migrations on startup
2. Seeds an admin account if configured

Default admin credentials (configurable):
- Email: `admin@thinktogether.com`
- Password: `Admin123!`

## API Documentation

When running in Development mode, visit `http://localhost:5000/swagger` for interactive API documentation.

## Project Structure

- `Controllers/`: API controllers
- `Properties/`: Launch settings and configuration
- `appsettings.json`: Application configuration
- `Program.cs`: Application entry point
