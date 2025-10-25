using Domain.Aggregates.ChallengeAggregate.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class LeaderboardEntryConfiguration : IEntityTypeConfiguration<LeaderboardEntry>
{
    public void Configure(EntityTypeBuilder<LeaderboardEntry> builder)
    {
        builder.ToTable("BangXepHangThachThuc");
        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("idBangXepHang")
            .ValueGeneratedNever(); // Application generates the ID

        builder.Property(e => e.ChallengeId)
            .HasColumnName("idThachThuc")
            .IsRequired();

        builder.Property(e => e.StudentName)
            .HasColumnName("tenHocSinh")
            .IsRequired()
            .HasMaxLength(255);

        builder.OwnsOne(e => e.Score, score =>
        {
            score.Property(s => s.Value)
                .HasColumnName("diemCaoNhat")
                .HasDefaultValue(0);
        });

        builder.Property(e => e.Rank)
            .HasColumnName("xepHang");

        builder.Property(e => e.AchievedAt)
            .HasColumnName("thoiGianDatDiem")
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(e => e.CreatedAt)
            .HasColumnName("ngayTao")
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(e => e.UpdatedAt)
            .HasColumnName("ngayCapNhat");

        builder.Property(e => e.DeletedAt)
            .HasColumnName("ngayXoa");

        // Indexes
        builder.HasIndex(e => e.ChallengeId);
        builder.HasIndex(e => new { e.ChallengeId, e.Rank });
        builder.HasIndex(e => e.DeletedAt);
    }
}
