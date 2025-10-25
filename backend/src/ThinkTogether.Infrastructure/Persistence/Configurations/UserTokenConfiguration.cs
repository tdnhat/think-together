using Domain.Aggregates.UserAggregate;
using Domain.Aggregates.UserAggregate.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ThinkTogether.Infrastructure.Persistence.Configurations;

public class UserTokenConfiguration : IEntityTypeConfiguration<UserToken>
{
    public void Configure(EntityTypeBuilder<UserToken> builder)
    {
        builder.ToTable("MaNguoiDung");

        builder.HasKey(ut => ut.Id);

        builder.Property(ut => ut.Id)
            .HasColumnName("idMaNguoiDung")
            .ValueGeneratedNever(); // Application generates the ID

        builder.Property(ut => ut.Type)
            .HasColumnName("loaiToken")
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(ut => ut.UserId)
            .HasColumnName("idNguoiDung")
            .IsRequired();

        builder.Property(ut => ut.Token)
            .HasColumnName("maToken")
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(ut => ut.ExpiresAt)
            .HasColumnName("hetHanLuc")
            .IsRequired();

        builder.Property(ut => ut.UsedAt)
            .HasColumnName("suDungLuc");

        builder.Property(ut => ut.CreatedAt)
            .HasColumnName("taoLuc")
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(ut => ut.UpdatedAt)
            .HasColumnName("capNhatLuc");

        // Foreign key relationship
        builder.HasOne<User>()
            .WithMany(u => u.UserTokens)
            .HasForeignKey(ut => ut.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Indexes
        builder.HasIndex(ut => ut.UserId);
        builder.HasIndex(ut => ut.Token).IsUnique();
        builder.HasIndex(ut => ut.Type);
        builder.HasIndex(ut => ut.ExpiresAt);
        builder.HasIndex(ut => ut.UsedAt);
        
        // Composite index for efficient queries
        builder.HasIndex(ut => new { ut.UserId, ut.Type, ut.UsedAt });
    }
}
