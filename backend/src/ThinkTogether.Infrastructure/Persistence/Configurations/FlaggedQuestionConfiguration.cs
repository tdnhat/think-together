using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Entities;

namespace ThinkTogether.Infrastructure.Persistence.Configurations;

public class FlaggedQuestionConfiguration : IEntityTypeConfiguration<FlaggedQuestion>
{
    public void Configure(EntityTypeBuilder<FlaggedQuestion> builder)
    {
        builder.ToTable("CauHoiDanhDau");

        builder.HasKey(fq => fq.Id);

        builder.Property(fq => fq.Id)
            .HasColumnName("idCauHoiDanhDau")
            .ValueGeneratedNever();

        builder.Property(fq => fq.ChallengeAttemptId)
            .HasColumnName("idLuotChoiThachThuc")
            .IsRequired();

        builder.Property(fq => fq.QuestionId)
            .HasColumnName("idCauHoi")
            .IsRequired();

        builder.Property(fq => fq.CreatedAt)
            .HasColumnName("ngayTao")
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(fq => fq.UpdatedAt)
            .HasColumnName("ngayCapNhat");

        builder.Property(fq => fq.DeletedAt)
            .HasColumnName("ngayXoa");

        // Note: Foreign key to ChallengeAttempt is defined in ChallengeAttemptConfiguration using navigation property

        // Foreign key to Question
        builder.HasOne<global::ThinkTogether.Domain.Aggregates.QuizSetAggregate.Entities.Question>()
            .WithMany()
            .HasForeignKey(fq => fq.QuestionId)
            .OnDelete(DeleteBehavior.Restrict);

        // Indexes
        builder.HasIndex(fq => fq.ChallengeAttemptId);
        builder.HasIndex(fq => fq.QuestionId);
        builder.HasIndex(fq => new { fq.ChallengeAttemptId, fq.QuestionId }).IsUnique();
        builder.HasIndex(fq => fq.DeletedAt);
    }
}
