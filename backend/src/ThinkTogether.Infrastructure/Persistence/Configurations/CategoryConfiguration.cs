using ThinkTogether.Domain.Aggregates.CategoryAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ThinkTogether.Infrastructure.Persistence.Configurations;

public class CategoryConfiguration : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.ToTable("DanhMuc");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.Id)
            .HasColumnName("idDanhMuc")
            .ValueGeneratedNever();

        builder.Property(c => c.Name)
            .HasColumnName("tenDanhMuc")
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(c => c.Description)
            .HasColumnName("moTa")
            .HasMaxLength(2000);

        builder.Property(c => c.IsActive)
            .HasColumnName("daKichHoat")
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(c => c.CreatedAt)
            .HasColumnName("ngayTao")
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(c => c.UpdatedAt)
            .HasColumnName("ngayCapNhat");

        builder.Property(c => c.DeletedAt)
            .HasColumnName("ngayXoa");

        // Indexes for performance
        builder.HasIndex(c => c.Name)
            .IsUnique()
            .HasFilter("[ngayXoa] IS NULL")
            .HasDatabaseName("IDX_DanhMuc_tenDanhMuc");

        builder.HasIndex(c => c.IsActive)
            .HasDatabaseName("IDX_DanhMuc_IsActive");

        builder.HasIndex(c => c.DeletedAt)
            .HasDatabaseName("IDX_DanhMuc_ngayXoa");
    }
}

