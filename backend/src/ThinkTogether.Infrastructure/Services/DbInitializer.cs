using Infrastructure.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using ThinkTogether.Domain.Aggregates.UserAggregate;
using ThinkTogether.Domain.Aggregates.UserAggregate.Services;
using ThinkTogether.Domain.Aggregates.UserAggregate.ValueObjects;
using ThinkTogether.Domain.Enums;
using ThinkTogether.Infrastructure.Interfaces;
using ThinkTogether.Infrastructure.Persistence;

namespace ThinkTogether.Infrastructure.Services;

public class DbInitializer : IDbInitializer
{
    private readonly ApplicationDbContext _context;
    private readonly IOptions<AdminSeedOptions> _adminOptions;
    private readonly IPasswordService _passwordService;

    public DbInitializer(
        ApplicationDbContext context,
        IOptions<AdminSeedOptions> adminOptions,
        IPasswordService passwordService)
    {
        _context = context;
        _adminOptions = adminOptions;
        _passwordService = passwordService;
    }

    public async Task InitializeAsync()
    {
        // Apply migrations
        await _context.Database.MigrateAsync();

        // Seed admin user
        await SeedAdminUserAsync();
    }

    private async Task SeedAdminUserAsync()
    {
        var adminOptions = _adminOptions.Value;

        if (string.IsNullOrWhiteSpace(adminOptions.Email) ||
            string.IsNullOrWhiteSpace(adminOptions.Password) ||
            string.IsNullOrWhiteSpace(adminOptions.FirstName) ||
            string.IsNullOrWhiteSpace(adminOptions.LastName))
        {
            return; // Skip seeding if options are not configured
        }

        var adminEmailValue = adminOptions.Email.Trim().ToLowerInvariant();
        var existingAdmin = await _context.Users
            .FirstOrDefaultAsync(u => (string)u.Email == adminEmailValue);

        if (existingAdmin != null)
        {
            return; // Admin already exists
        }

        var adminEmail = Email.Create(adminEmailValue);
        var passwordHash = _passwordService.HashPassword(adminOptions.Password);
        var adminUser = User.Create(
            adminEmail,
            adminOptions.FirstName,
            adminOptions.LastName,
            passwordHash,
            RoleType.Administrator
        );

        _context.Users.Add(adminUser);
        await _context.SaveChangesAsync();
    }
}
