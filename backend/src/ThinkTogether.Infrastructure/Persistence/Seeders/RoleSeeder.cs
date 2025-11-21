using Microsoft.EntityFrameworkCore;
using ThinkTogether.Domain.Aggregates.UserAggregate;
using ThinkTogether.Domain.Aggregates.UserAggregate.Entities;

namespace ThinkTogether.Infrastructure.Persistence.Seeders;

public static class RoleSeeder
{
    public static async Task SeedRolesAsync(ApplicationDbContext context)
    {
        // Check if roles already exist
        var existingRoles = await context.Roles.CountAsync();
        if (existingRoles > 0)
            return;

        // Create predefined roles with English names
        var roles = new[]
        {
            Role.Create(User.UserRoleId, "User", "Người dùng thông thường"),
            Role.Create(User.CreatorRoleId, "Creator", "Người sáng tạo"),
            Role.Create(User.AdminRoleId, "Administrator", "Quản trị viên")
        };

        // Add roles to database
        foreach (var role in roles)
        {
            context.Roles.Add(role);
        }

        await context.SaveChangesAsync();
    }
}

