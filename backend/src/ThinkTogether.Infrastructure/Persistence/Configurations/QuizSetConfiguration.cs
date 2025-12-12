using ThinkTogether.Domain.Aggregates.QuizSetAggregate;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ThinkTogether.Domain.Aggregates.UserAggregate;

namespace ThinkTogether.Infrastructure.Persistence.Configurations;

public class QuizSetConfiguration : IEntityTypeConfiguration<QuizSet>
{
    public void Configure(EntityTypeBuilder<QuizSet> builder)
    {
        builder.ToTable("BoTracNghiem");

        builder.HasKey(qs => qs.Id);

        builder.Property(qs => qs.Id)
            .HasColumnName("idBoTracNghiem")
            .ValueGeneratedNever();

        builder.Property(qs => qs.CreatorId)
            .HasColumnName("idNguoiTao")
            .IsRequired();

        builder.Property(qs => qs.Title)
            .HasColumnName("tieuDe")
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(qs => qs.Description)
            .HasColumnName("moTa")
            .HasMaxLength(2000);

        builder.Property(qs => qs.CoverImageUrl)
            .HasColumnName("urlAnhBia")
            .HasMaxLength(500);

        builder.Property(qs => qs.IsPublished)
            .HasColumnName("daDangTai")
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(qs => qs.DisplayOrder)
            .HasColumnName("thuTu")
            .IsRequired()
            .HasDefaultValue(0);

        builder.Property(qs => qs.CreatedAt)
            .HasColumnName("ngayTao")
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(qs => qs.UpdatedAt)
            .HasColumnName("ngayCapNhat");

        builder.Property(qs => qs.DeletedAt)
            .HasColumnName("ngayXoa");

        // Foreign key to User (Creator)
        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(qs => qs.CreatorId)
            .OnDelete(DeleteBehavior.Restrict);

        // Relationship to Questions - use navigation property to avoid shadow FK
        builder.HasMany(qs => qs.Questions)
            .WithOne()
            .HasForeignKey(q => q.QuizSetId)
            .OnDelete(DeleteBehavior.Cascade);

        // Indexes
        builder.HasIndex(qs => qs.CreatorId);
        builder.HasIndex(qs => qs.IsPublished);
        builder.HasIndex(qs => qs.DeletedAt);
        builder.HasIndex(qs => new { qs.IsPublished, qs.DeletedAt, qs.CreatedAt });
    }
}

