using Infrastructure.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using ThinkTogether.Domain.Aggregates.CategoryAggregate;
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

        // Seed categories
        await SeedCategoriesAsync();
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

    private async Task SeedCategoriesAsync()
    {
        if (await _context.Categories.AnyAsync())
        {
            return; // Categories already seeded
        }

        var categories = new List<Category>
        {
            Category.Create("Toán học", "Các bài kiểm tra về Toán học"),
            Category.Create("Vật lý", "Các bài kiểm tra về Vật lý"),
            Category.Create("Hóa học", "Các bài kiểm tra về Hóa học"),
            Category.Create("Sinh học", "Các bài kiểm tra về Sinh học"),
            Category.Create("Lịch sử", "Các bài kiểm tra về Lịch sử"),
            Category.Create("Địa lý", "Các bài kiểm tra về Địa lý"),
            Category.Create("Văn học", "Các bài kiểm tra về Văn học"),
            Category.Create("Tiếng Anh", "Các bài kiểm tra về Tiếng Anh"),
            Category.Create("Tin học", "Các bài kiểm tra về Tin học"),
            Category.Create("Công nghệ", "Các bài kiểm tra về Công nghệ")
        };

        _context.Categories.AddRange(categories);
        await _context.SaveChangesAsync();
    }
}
