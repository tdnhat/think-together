using Domain.Aggregates.ChallengeAggregate;
using Domain.Aggregates.GameSessionAggregate;
using Domain.Aggregates.QuizSetAggregate;
using Domain.Aggregates.UserAggregate;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence.Interceptors;

namespace Infrastructure.Persistence;

public class ApplicationDbContext : DbContext
{
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<QuizSet> QuizSets { get; set; } = null!;
    public DbSet<GameSession> GameSessions { get; set; } = null!;
    public DbSet<Challenge> Challenges { get; set; } = null!;

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        // Register audit interceptor
        optionsBuilder.AddInterceptors(new AuditInterceptor());
        base.OnConfiguring(optionsBuilder);
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }
}
