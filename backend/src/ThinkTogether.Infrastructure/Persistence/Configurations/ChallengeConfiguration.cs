using Domain.Aggregates.ChallengeAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ThinkTogether.Domain.Aggregates.UserAggregate;

namespace ThinkTogether.Infrastructure.Persistence.Configurations;

public class ChallengeConfiguration : IEntityTypeConfiguration<Challenge>
{
    public void Configure(EntityTypeBuilder<Challenge> builder)
    {
        builder.ToTable("ThachThuc");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.Id)
            .HasColumnName("idThachThuc")
            .ValueGeneratedNever();

        builder.Property(c => c.CreatorId)
            .HasColumnName("idNguoiTao")
            .IsRequired();

        builder.Property(c => c.QuizSetId)
            .HasColumnName("idBoTracNghiem")
            .IsRequired();

        builder.Property(c => c.Title)
            .HasColumnName("tieuDe")
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(c => c.Description)
            .HasColumnName("moTa")
            .HasMaxLength(2000);

        builder.Property(c => c.ShareLink)
            .HasColumnName("urlChiaSe")
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(c => c.Status)
            .HasColumnName("trangThai")
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.Property(c => c.ShowLeaderboard)
            .HasColumnName("hienThiBangXepHang")
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(c => c.PlayCount)
            .HasColumnName("luotChoi")
            .IsRequired()
            .HasDefaultValue(0);

        builder.Property(c => c.CreatedAt)
            .HasColumnName("ngayTao")
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(c => c.UpdatedAt)
            .HasColumnName("ngayCapNhat");

        builder.Property(c => c.DeletedAt)
            .HasColumnName("ngayXoa");

        // Add check constraints
        builder.ToTable(tb =>
        {
            tb.HasCheckConstraint("CK_ThachThuc_trangThai",
                "trangThai IN ('Active', 'Archived')");
            tb.HasCheckConstraint("CK_ThachThuc_luotChoi", "luotChoi >= 0");
        });

        // Unique constraint on ShareLink
        builder.HasIndex(c => c.ShareLink).IsUnique();

        // Foreign keys
        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(c => c.CreatorId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<global::Domain.Aggregates.QuizAggregate.QuizSet>()
            .WithMany()
            .HasForeignKey(c => c.QuizSetId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany<global::Domain.Aggregates.ChallengeAggregate.Entities.ChallengeAttempt>()
            .WithOne()
            .HasForeignKey(ca => ca.ChallengeId)
            .OnDelete(DeleteBehavior.Cascade);

        // Indexes
        builder.HasIndex(c => c.CreatorId);
        builder.HasIndex(c => c.QuizSetId);
        builder.HasIndex(c => c.Status);
        builder.HasIndex(c => c.DeletedAt);
        builder.HasIndex(c => new { c.Status, c.DeletedAt, c.PlayCount });
    }
}

