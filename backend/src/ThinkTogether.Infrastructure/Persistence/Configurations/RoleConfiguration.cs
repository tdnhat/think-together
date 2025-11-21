using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ThinkTogether.Domain.Aggregates.UserAggregate.Entities;

namespace ThinkTogether.Infrastructure.Persistence.Configurations;

public class RoleConfiguration : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        builder.ToTable("VaiTro");

        builder.HasKey(r => r.Id);

        builder.Property(r => r.Id)
            .HasColumnName("idVaiTro")
            .ValueGeneratedNever();

        builder.Property(r => r.Name)
            .HasColumnName("tenVaiTro")
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.HasIndex(r => r.Name).IsUnique();

        builder.Property(r => r.Description)
            .HasColumnName("moTa")
            .HasMaxLength(255);

        builder.Property(r => r.CreatedAt)
            .HasColumnName("ngayTao")
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(r => r.UpdatedAt)
            .HasColumnName("ngayCapNhat");
    }
}
