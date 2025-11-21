using Domain.Aggregates.ClassAggregate.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ThinkTogether.Domain.Aggregates.UserAggregate;

namespace ThinkTogether.Infrastructure.Persistence.Configurations;

public class HomeworkSubmissionConfiguration : IEntityTypeConfiguration<HomeworkSubmission>
{
    public void Configure(EntityTypeBuilder<HomeworkSubmission> builder)
    {
        builder.ToTable("BaiNop");

        builder.HasKey(hs => hs.Id);

        builder.Property(hs => hs.Id)
            .HasColumnName("idBaiNop")
            .ValueGeneratedNever();

        builder.Property(hs => hs.HomeworkId)
            .HasColumnName("idBaiTapVeNha")
            .IsRequired();

        builder.Property(hs => hs.StudentId)
            .HasColumnName("idNguoiDung")
            .IsRequired();

        builder.Property(hs => hs.ChallengeAttemptId)
            .HasColumnName("idLuotChoiThachThuc")
            .IsRequired();

        builder.Property(hs => hs.Score)
            .HasColumnName("diem")
            .IsRequired()
            .HasDefaultValue(0);

        builder.Property(hs => hs.SubmittedAt)
            .HasColumnName("thoiGianNop")
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(hs => hs.Status)
            .HasColumnName("trangThai")
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.Property(hs => hs.CreatedAt)
            .HasColumnName("ngayTao")
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(hs => hs.UpdatedAt)
            .HasColumnName("ngayCapNhat");

        builder.Property(hs => hs.DeletedAt)
            .HasColumnName("ngayXoa");

        // Add check constraints
        builder.ToTable(tb =>
        {
            tb.HasCheckConstraint("CK_BaiNop_trangThai",
                "trangThai IN ('Submitted', 'Late', 'NotSubmitted')");
            tb.HasCheckConstraint("CK_BaiNop_diem", "diem >= 0");
        });

        // Unique constraint on (HomeworkId, StudentId)
        builder.HasIndex(hs => new { hs.HomeworkId, hs.StudentId }).IsUnique();

        // Unique constraint on ChallengeAttemptId
        builder.HasIndex(hs => hs.ChallengeAttemptId).IsUnique();

        // Foreign keys - explicitly configure without navigation properties
        builder.HasOne<Homework>()
            .WithMany()
            .HasForeignKey("HomeworkId")
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey("StudentId")
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<global::Domain.Aggregates.ChallengeAggregate.Entities.ChallengeAttempt>()
            .WithMany()
            .HasForeignKey("ChallengeAttemptId")
            .OnDelete(DeleteBehavior.Restrict);

        // Indexes
        builder.HasIndex(hs => hs.StudentId);
        builder.HasIndex(hs => hs.ChallengeAttemptId);
        builder.HasIndex(hs => hs.Status);
    }
}

