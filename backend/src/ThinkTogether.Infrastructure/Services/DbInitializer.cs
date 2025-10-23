using Application.Services;
using Domain.Aggregates.UserAggregate;
using Domain.Aggregates.UserAggregate.Entities;
using Domain.Aggregates.UserAggregate.ValueObjects;
using Infrastructure.Configuration;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Infrastructure.Services;

public class DbInitializer : IDbInitializer
{
    private readonly ApplicationDbContext _context;
    private readonly IOptions<AdminSeedOptions> _adminOptions;
    private readonly IPasswordHasher _passwordHasher;

    public DbInitializer(
        ApplicationDbContext context,
        IOptions<AdminSeedOptions> adminOptions,
        IPasswordHasher passwordHasher)
    {
        _context = context;
        _adminOptions = adminOptions;
        _passwordHasher = passwordHasher;
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
        var passwordHashString = _passwordHasher.Hash(adminOptions.Password);
        var passwordHash = Password.CreateFromHash(passwordHashString);
        var adminUser = User.Create(
            adminEmail,
            adminOptions.FirstName,
            adminOptions.LastName,
            passwordHash,
            UserRole.QUANTRI
        );

        _context.Users.Add(adminUser);
        await _context.SaveChangesAsync();
    }
}
