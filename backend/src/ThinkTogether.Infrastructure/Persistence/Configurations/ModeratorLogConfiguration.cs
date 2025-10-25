using Domain.Aggregates.UserAggregate.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ThinkTogether.Domain.Aggregates.UserAggregate.Entities;

namespace Infrastructure.Persistence.Configurations;

public class ModeratorLogConfiguration : IEntityTypeConfiguration<ModeratorLog>
{
    public void Configure(EntityTypeBuilder<ModeratorLog> builder)
    {
        builder.ToTable("NhatKyQuanTri");
        builder.HasKey(ml => ml.Id);

        builder.Property(ml => ml.Id)
            .HasColumnName("idNhatKy")
            .ValueGeneratedNever(); // Application generates the ID

        builder.Property(ml => ml.AdminId)
            .HasColumnName("idQuanTri")
            .IsRequired();

        builder.Property(ml => ml.Action)
            .HasColumnName("hanhDong")
            .IsRequired()
            .HasConversion<string>();

        builder.Property(ml => ml.EntityType)
            .HasColumnName("loaiThucThe")
            .IsRequired()
            .HasConversion<string>();

        builder.Property(ml => ml.EntityId)
            .HasColumnName("idThucThe")
            .IsRequired();

        builder.Property(ml => ml.Reason)
            .HasColumnName("lyDo")
            .IsRequired()
            .HasMaxLength(-1);

        builder.Property(ml => ml.Notes)
            .HasColumnName("ghiChu")
            .HasMaxLength(-1);

        builder.Property(ml => ml.Resolved)
            .HasColumnName("daGiaiQuyet")
            .HasDefaultValue(false);

        builder.Property(ml => ml.CreatedAt)
            .HasColumnName("ngayTao")
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(ml => ml.UpdatedAt)
            .HasColumnName("ngayCapNhat");

        builder.Property(ml => ml.ResolvedAt)
            .HasColumnName("ngayGiaiQuyet");

        // Indexes
        builder.HasIndex(ml => ml.AdminId);
        builder.HasIndex(ml => ml.Action);
        builder.HasIndex(ml => ml.EntityType);
        builder.HasIndex(ml => ml.EntityId);
        builder.HasIndex(ml => ml.Resolved);
        builder.HasIndex(ml => ml.CreatedAt);
        builder.HasIndex(ml => ml.ResolvedAt);
    }
}
