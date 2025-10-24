using Domain.Aggregates.UserAggregate.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ThinkTogether.Domain.Aggregates.UserAggregate.Entities;

namespace Infrastructure.Persistence.Configurations;

public class AuditLogConfiguration : IEntityTypeConfiguration<AuditLog>
{
    public void Configure(EntityTypeBuilder<AuditLog> builder)
    {
        builder.ToTable("NhatKyHeThong");
        builder.HasKey(al => al.Id);

        builder.Property(al => al.Id)
            .HasColumnName("idNhatKy")
            .ValueGeneratedNever(); // Application generates the ID

        builder.Property(al => al.ChangedById)
            .HasColumnName("idNguoiThayDoi")
            .IsRequired();

        builder.Property(al => al.EntityType)
            .HasColumnName("loaiThucThe")
            .IsRequired()
            .HasConversion<string>();

        builder.Property(al => al.EntityId)
            .HasColumnName("idThucThe")
            .IsRequired();

        builder.Property(al => al.Action)
            .HasColumnName("hanhDong")
            .IsRequired()
            .HasConversion<string>();

        builder.Property(al => al.OldValues)
            .HasColumnName("giaTriCu")
            .HasMaxLength(-1); // JSON

        builder.Property(al => al.NewValues)
            .HasColumnName("giaTriMoi")
            .HasMaxLength(-1); // JSON

        builder.Property(al => al.IpAddress)
            .HasColumnName("diaChiIP")
            .HasMaxLength(45); // IPv6 support

        builder.Property(al => al.CreatedAt)
            .HasColumnName("thoiGianThayDoi")
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        // Indexes
        builder.HasIndex(al => al.ChangedById);
        builder.HasIndex(al => al.EntityType);
        builder.HasIndex(al => al.EntityId);
        builder.HasIndex(al => al.Action);
        builder.HasIndex(al => al.CreatedAt);
    }
}
