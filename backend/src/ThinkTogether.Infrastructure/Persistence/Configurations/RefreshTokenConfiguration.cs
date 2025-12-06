using ThinkTogether.Domain.Aggregates.UserAggregate.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ThinkTogether.Infrastructure.Persistence.Configurations;

public class RefreshTokenConfiguration : IEntityTypeConfiguration<RefreshToken>
{
    public void Configure(EntityTypeBuilder<RefreshToken> builder)
    {
        builder.ToTable("MaLamMoi");

        builder.HasKey(rt => rt.Id);

        builder.Property(rt => rt.Id)
            .HasColumnName("idMaLamMoi")
            .ValueGeneratedNever(); // Application generates the ID

        builder.Property(rt => rt.UserId)
            .HasColumnName("idNguoiDung")
            .IsRequired();

        builder.Property(rt => rt.Token)
            .HasColumnName("maToken")
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(rt => rt.ExpiresAt)
            .HasColumnName("hetHanLuc")
            .IsRequired();

        builder.Property(rt => rt.RevokedAt)
            .HasColumnName("thuHoiLuc");

        builder.Property(rt => rt.CreatedAt)
            .HasColumnName("ngayTao")
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(rt => rt.UpdatedAt)
            .HasColumnName("ngayCapNhat");

        // Note: Foreign key relationship is defined in UserConfiguration

        // Indexes
        builder.HasIndex(rt => rt.UserId);
        builder.HasIndex(rt => rt.Token).IsUnique();
        builder.HasIndex(rt => rt.ExpiresAt);
        builder.HasIndex(rt => rt.RevokedAt);
    }
}
