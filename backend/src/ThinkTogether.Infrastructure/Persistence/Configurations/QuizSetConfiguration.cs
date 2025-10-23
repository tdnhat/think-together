using Domain.Aggregates.QuizSetAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class QuizSetConfiguration : IEntityTypeConfiguration<QuizSet>
{
    public void Configure(EntityTypeBuilder<QuizSet> builder)
    {
        builder.ToTable("BoTrucNghiem");
        builder.HasKey(q => q.Id);
        
        // Properties mapping to Vietnamese column names
        builder.Property(q => q.Id)
        .HasColumnName("idBoTrucNghiem")
        .ValueGeneratedOnAdd();

        builder.Property(q => q.UserId)
        .HasColumnName("idNguoiDung")
        .IsRequired();

        builder.Property(q => q.Title)
            .HasColumnName("tieuDe")
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(q => q.Description)
            .HasColumnName("moTa")
            .HasMaxLength(-1);

        builder.Property(q => q.CoverImageUrl)
            .HasColumnName("urlAnhBia")
            .HasMaxLength(500);

        builder.Property(q => q.IsPublished)
            .HasColumnName("daDangTai")
            .HasDefaultValue(false);

        builder.Property(q => q.DisplayOrder)
            .HasColumnName("thuTu")
            .HasDefaultValue(0);

        builder.Property(q => q.CreatedAt)
            .HasColumnName("ngayTao")
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(q => q.UpdatedAt)
            .HasColumnName("ngayCapNhat");

        builder.Property(q => q.DeletedAt)
        .HasColumnName("ngayXoa");

        // Indexes
        builder.HasIndex(q => q.UserId);
        builder.HasIndex(q => q.IsPublished);
        builder.HasIndex(q => q.DeletedAt);
    }
}


