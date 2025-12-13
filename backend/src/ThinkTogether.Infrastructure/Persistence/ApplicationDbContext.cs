using ThinkTogether.Domain.Aggregates.QuizSetAggregate;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Entities;
using Microsoft.EntityFrameworkCore;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Entities;
using ThinkTogether.Domain.Aggregates.ClassAggregate;
using ThinkTogether.Domain.Aggregates.ClassAggregate.Entities;
using ThinkTogether.Domain.Aggregates.GamingAggregate;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Entities;
using ThinkTogether.Domain.Aggregates.UserAggregate;
using ThinkTogether.Domain.Aggregates.UserAggregate.Entities;
using ThinkTogether.Infrastructure.Persistence.Interceptors;

namespace ThinkTogether.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext
{
    // User Aggregate Entities
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<RefreshToken> RefreshTokens { get; set; } = null!;
    public DbSet<UserToken> UserTokens { get; set; } = null!;

    // Quiz Aggregate Entities
    public DbSet<QuizSet> QuizSets { get; set; } = null!;
    public DbSet<Question> Questions { get; set; } = null!;
    public DbSet<QuestionStatistic> QuestionStatistics { get; set; } = null!;

    // Gaming Aggregate Entities
    public DbSet<GameSession> GameSessions { get; set; } = null!;
    public DbSet<GamePlayer> GamePlayers { get; set; } = null!;
    public DbSet<GameQuestion> GameQuestions { get; set; } = null!;
    public DbSet<PlayerAnswer> PlayerAnswers { get; set; } = null!;
    public DbSet<GameScore> GameScores { get; set; } = null!;
    public DbSet<GameSettings> GameSettings { get; set; } = null!;

    // Challenge Aggregate Entities
    public DbSet<Challenge> Challenges { get; set; } = null!;
    public DbSet<ChallengeAttempt> ChallengeAttempts { get; set; } = null!;
    public DbSet<ChallengeAnswer> ChallengeAnswers { get; set; } = null!;
    public DbSet<FlaggedQuestion> FlaggedQuestions { get; set; } = null!;

    // Class Aggregate Entities
    public DbSet<Class> Classes { get; set; } = null!;
    public DbSet<ClassMember> ClassMembers { get; set; } = null!;
    public DbSet<Homework> Homeworks { get; set; } = null!;
    public DbSet<HomeworkSubmission> HomeworkSubmissions { get; set; } = null!;

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        // Register audit interceptor
        optionsBuilder.AddInterceptors(new AuditInterceptor());
        
        base.OnConfiguring(optionsBuilder);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }
}

