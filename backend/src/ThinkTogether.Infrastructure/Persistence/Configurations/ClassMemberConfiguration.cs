using Domain.Aggregates.ClassAggregate.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ThinkTogether.Domain.Aggregates.UserAggregate;

namespace ThinkTogether.Infrastructure.Persistence.Configurations;

public class ClassMemberConfiguration : IEntityTypeConfiguration<ClassMember>
{
    public void Configure(EntityTypeBuilder<ClassMember> builder)
    {
        builder.ToTable("ThanhVienLop");

        builder.HasKey(cm => cm.Id);

        builder.Property(cm => cm.Id)
            .HasColumnName("idThanhVien")
            .ValueGeneratedNever();

        builder.Property(cm => cm.ClassId)
            .HasColumnName("idLopHoc")
            .IsRequired();

        builder.Property(cm => cm.UserId)
            .HasColumnName("idNguoiDung")
            .IsRequired();

        builder.Property(cm => cm.JoinedAt)
            .HasColumnName("ngayThamGia")
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(cm => cm.LeftAt)
            .HasColumnName("ngayRoi");

        builder.Property(cm => cm.CreatedAt)
            .HasColumnName("ngayTao")
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(cm => cm.UpdatedAt)
            .HasColumnName("ngayCapNhat");

        builder.Property(cm => cm.DeletedAt)
            .HasColumnName("ngayXoa");

        // Foreign keys - explicitly configure without navigation properties
        builder.HasOne<global::Domain.Aggregates.ClassAggregate.Class>()
            .WithMany()
            .HasForeignKey("ClassId")
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey("UserId")
            .OnDelete(DeleteBehavior.Restrict);

        // Unique constraint: one user per class
        builder.HasIndex(cm => new { cm.ClassId, cm.UserId }).IsUnique();

        // Indexes
        builder.HasIndex(cm => cm.ClassId);
        builder.HasIndex(cm => cm.UserId);
    }
}

