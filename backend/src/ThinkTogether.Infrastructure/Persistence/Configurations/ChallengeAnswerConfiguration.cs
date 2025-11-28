using Domain.Aggregates.ChallengeAggregate.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class ChallengeAnswerConfiguration : IEntityTypeConfiguration<ChallengeAnswer>
{
    public void Configure(EntityTypeBuilder<ChallengeAnswer> builder)
    {
        builder.ToTable("CauTraLoiThachThuc");

        builder.HasKey(ca => ca.Id);

        builder.Property(ca => ca.Id)
            .HasColumnName("idCauTraLoi")
            .ValueGeneratedNever();

        builder.Property(ca => ca.ChallengeAttemptId)
            .HasColumnName("idLuotChoiThachThuc")
            .IsRequired();

        builder.Property(ca => ca.QuestionId)
            .HasColumnName("idCauHoi")
            .IsRequired();

        builder.Property(ca => ca.SubmissionTimeMs)
            .HasColumnName("thoiGianNopMs")
            .IsRequired()
            .HasDefaultValue(0);

        builder.Property(ca => ca.IsCorrect)
            .HasColumnName("dung")
            .IsRequired();

        builder.Property(ca => ca.PointsEarned)
            .HasColumnName("diemDat")
            .IsRequired()
            .HasDefaultValue(0);

        builder.Property(ca => ca.CreatedAt)
            .HasColumnName("ngayTao")
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(ca => ca.UpdatedAt)
            .HasColumnName("ngayCapNhat");

        builder.Property(ca => ca.DeletedAt)
            .HasColumnName("ngayXoa");

        // Add check constraints
        builder.ToTable(tb =>
        {
            tb.HasCheckConstraint("CK_CauTraLoiThachThuc_thoiGianNopMs",
                "thoiGianNopMs >= 0");
            tb.HasCheckConstraint("CK_CauTraLoiThachThuc_diemDat", "diemDat >= 0");
        });

        // Foreign keys
        builder.HasOne<Domain.Aggregates.ChallengeAggregate.Entities.ChallengeAttempt>()
            .WithMany()
            .HasForeignKey(ca => ca.ChallengeAttemptId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne<ThinkTogether.Domain.Aggregates.QuizSetAggregate.Entities.Question>()
            .WithMany()
            .HasForeignKey(ca => ca.QuestionId)
            .OnDelete(DeleteBehavior.Restrict);

        // Indexes
        builder.HasIndex(ca => ca.ChallengeAttemptId);
        builder.HasIndex(ca => ca.QuestionId);
        builder.HasIndex(ca => new { ca.ChallengeAttemptId, ca.QuestionId }).IsUnique();
        builder.HasIndex(ca => ca.DeletedAt);
    }
}

