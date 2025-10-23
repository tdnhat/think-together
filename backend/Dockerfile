# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj files and restore dependencies
COPY ["src/ThinkTogether.Api/ThinkTogether.Api.csproj", "ThinkTogether.Api/"]
COPY ["src/ThinkTogether.Application/ThinkTogether.Application.csproj", "ThinkTogether.Application/"]
COPY ["src/ThinkTogether.Infrastructure/ThinkTogether.Infrastructure.csproj", "ThinkTogether.Infrastructure/"]
COPY ["src/ThinkTogether.Domain/ThinkTogether.Domain.csproj", "ThinkTogether.Domain/"]
COPY ["src/ThinkTogether.Shared/ThinkTogether.Shared.csproj", "ThinkTogether.Shared/"]

RUN dotnet restore "ThinkTogether.Api/ThinkTogether.Api.csproj"

# Copy everything else and build
COPY src/ .
WORKDIR "/src/ThinkTogether.Api"
RUN dotnet build "ThinkTogether.Api.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "ThinkTogether.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ThinkTogether.Api.dll"]
