using Domain.Aggregates.ChallengeAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class ChallengeConfiguration : IEntityTypeConfiguration<Challenge>
{
    public void Configure(EntityTypeBuilder<Challenge> builder)
    {
        builder.ToTable("ThachThuc");
        builder.HasKey(c => c.Id);

        // Properties with Vietnamese column names
        builder.Property(c => c.Id)
        .HasColumnName("idThachThuc")
        .ValueGeneratedNever(); // Application generates the ID

        builder.Property(c => c.CreatorId)
        .HasColumnName("idNguoiTao")
        .IsRequired();

        builder.Property(c => c.QuizSetId)
        .HasColumnName("idBoTrucNghiem")
        .IsRequired();

        builder.Property(c => c.Title)
            .HasColumnName("tieuDe")
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(c => c.Description)
            .HasColumnName("moTa")
            .HasMaxLength(-1);

        builder.OwnsOne(c => c.ShareLink, shareLink =>
        {
            shareLink.Property(s => s.Value)
                .HasColumnName("urlChiaSeLink")
                .IsRequired()
                .HasMaxLength(500);
        });

        builder.Property(c => c.Status)
            .HasColumnName("trangThai")
            .IsRequired()
            .HasConversion<string>();

        builder.Property(c => c.ShowLeaderboard)
            .HasColumnName("hienThiBangXepHang")
            .HasDefaultValue(true);

        builder.Property(c => c.PlayCount)
            .HasColumnName("luotChoi")
            .HasDefaultValue(0);

        builder.Property(c => c.CreatedAt)
            .HasColumnName("ngayTao")
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(c => c.UpdatedAt)
            .HasColumnName("ngayCapNhat");

        builder.Property(c => c.DeletedAt)
        .HasColumnName("ngayXoa");

        // Indexes
        builder.HasIndex(c => c.CreatorId);
        builder.HasIndex(c => c.QuizSetId);
        builder.HasIndex(c => c.Status);
        builder.HasIndex(c => c.DeletedAt);
        }
}
