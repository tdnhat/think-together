using Domain.Aggregates.UserAggregate.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class MediaConfiguration : IEntityTypeConfiguration<Media>
{
    public void Configure(EntityTypeBuilder<Media> builder)
    {
        builder.ToTable("Media");
        builder.HasKey(m => m.Id);

        builder.Property(m => m.Id)
            .HasColumnName("idMedia")
            .ValueGeneratedOnAdd();

        builder.Property(m => m.UploadedById)
            .HasColumnName("idNguoiTaiLen")
            .IsRequired();

        builder.Property(m => m.Filename)
            .HasColumnName("tenFile")
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(m => m.Url)
            .HasColumnName("url")
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(m => m.Type)
            .HasColumnName("loai")
            .IsRequired()
            .HasConversion<string>();

        builder.Property(m => m.MimeType)
            .HasColumnName("loaiMime")
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(m => m.FileSizeBytes)
            .HasColumnName("kichThuocByte")
            .IsRequired();

        builder.Property(m => m.DurationSeconds)
            .HasColumnName("thoiLuongGiay"); // For videos

        builder.Property(m => m.CreatedAt)
            .HasColumnName("ngayTaiLen")
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(m => m.UpdatedAt)
            .HasColumnName("ngayCapNhat");

        builder.Property(m => m.DeletedAt)
            .HasColumnName("ngayXoa");

        // Indexes
        builder.HasIndex(m => m.UploadedById);
        builder.HasIndex(m => m.Type);
        builder.HasIndex(m => m.CreatedAt);
        builder.HasIndex(m => m.DeletedAt);
    }
}
