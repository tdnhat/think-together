using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Entities;
using ThinkTogether.Domain.Aggregates.ClassAggregate.Entities;
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

        // Store SubmissionStatus enum as integer
        builder.Property(hs => hs.Status)
            .HasColumnName("trangThai")
            .IsRequired()
            .HasConversion<int>();

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
                "trangThai IN (0, 1, 2)");
            tb.HasCheckConstraint("CK_BaiNop_diem", "diem >= 0");
        });

        // Unique constraint on (HomeworkId, StudentId)
        builder.HasIndex(hs => new { hs.HomeworkId, hs.StudentId }).IsUnique();

        // Unique constraint on ChallengeAttemptId
        builder.HasIndex(hs => hs.ChallengeAttemptId).IsUnique();

        // Note: Foreign key to Homework is defined in HomeworkConfiguration using navigation property

        // Foreign key to User (Student)
        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(hs => hs.StudentId)
            .OnDelete(DeleteBehavior.Restrict);

        // Foreign key to ChallengeAttempt
        builder.HasOne<ChallengeAttempt>()
            .WithMany()
            .HasForeignKey(hs => hs.ChallengeAttemptId)
            .OnDelete(DeleteBehavior.Restrict);

        // Indexes
        builder.HasIndex(hs => hs.StudentId);
        builder.HasIndex(hs => hs.ChallengeAttemptId);
        builder.HasIndex(hs => hs.Status);
    }
}

