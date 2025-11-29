using Domain.Aggregates.ChallengeAggregate.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ThinkTogether.Domain.Aggregates.UserAggregate;

namespace ThinkTogether.Infrastructure.Persistence.Configurations;

public class ChallengeAttemptConfiguration : IEntityTypeConfiguration<ChallengeAttempt>
{
    public void Configure(EntityTypeBuilder<ChallengeAttempt> builder)
    {
        builder.ToTable("LuotChoiThachThuc");

        builder.HasKey(ca => ca.Id);

        builder.Property(ca => ca.Id)
            .HasColumnName("idLuotChoi")
            .ValueGeneratedNever();

        builder.Property(ca => ca.ChallengeId)
            .HasColumnName("idThachThuc")
            .IsRequired();

        builder.Property(ca => ca.UserId)
            .HasColumnName("idNguoiDung");

        builder.Property(ca => ca.Nickname)
            .HasColumnName("bietDanh")
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(ca => ca.ScoreAchieved)
            .HasColumnName("diemDat")
            .IsRequired()
            .HasDefaultValue(0);

        builder.Property(ca => ca.CorrectAnswers)
            .HasColumnName("soCauDung")
            .IsRequired()
            .HasDefaultValue(0);

        builder.Property(ca => ca.TotalQuestions)
            .HasColumnName("tongSoCau")
            .IsRequired()
            .HasDefaultValue(0);

        builder.Property(ca => ca.CompletionTimeMs)
            .HasColumnName("thoiGianHoanThanhMs");

        builder.Property(ca => ca.CompletedAt)
            .HasColumnName("thoiGianHoanTatLuot")
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

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
            tb.HasCheckConstraint("CK_LuotChoiThachThuc_diemDat", "diemDat >= 0");
            tb.HasCheckConstraint("CK_LuotChoiThachThuc_soCauDung",
                "soCauDung >= 0 AND soCauDung <= tongSoCau");
            tb.HasCheckConstraint("CK_LuotChoiThachThuc_tongSoCau", "tongSoCau >= 0");
            tb.HasCheckConstraint("CK_LuotChoiThachThuc_thoiGian",
                "thoiGianHoanThanhMs IS NULL OR thoiGianHoanThanhMs > 0");
        });

        // Foreign keys
        builder.HasOne<global::Domain.Aggregates.ChallengeAggregate.Challenge>()
            .WithMany()
            .HasForeignKey(ca => ca.ChallengeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(ca => ca.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany<ChallengeAnswer>()
            .WithOne()
            .HasForeignKey(ca => ca.ChallengeAttemptId)
            .OnDelete(DeleteBehavior.Cascade);

        // Indexes
        builder.HasIndex(ca => ca.ChallengeId);
        builder.HasIndex(ca => ca.UserId);
        builder.HasIndex(ca => ca.Nickname);
        builder.HasIndex(ca => ca.CompletedAt);
        builder.HasIndex(ca => new { ca.ChallengeId, ca.ScoreAchieved, ca.CompletedAt });
        builder.HasIndex(ca => ca.DeletedAt);
    }
}

