using Domain.Aggregates.ClassAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ThinkTogether.Domain.Aggregates.UserAggregate;

namespace ThinkTogether.Infrastructure.Persistence.Configurations;

public class ClassConfiguration : IEntityTypeConfiguration<Class>
{
    public void Configure(EntityTypeBuilder<Class> builder)
    {
        builder.ToTable("LopHoc");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.Id)
            .HasColumnName("idLopHoc")
            .ValueGeneratedNever();

        builder.Property(c => c.TeacherId)
            .HasColumnName("idGiaoVien")
            .IsRequired();

        builder.Property(c => c.Name)
            .HasColumnName("tenLop")
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(c => c.Description)
            .HasColumnName("moTa")
            .HasMaxLength(2000);

        builder.Property(c => c.JoinCode)
            .HasColumnName("maLop")
            .IsRequired()
            .HasMaxLength(8);

        builder.Property(c => c.CoverImageUrl)
            .HasColumnName("urlAnhBia")
            .HasMaxLength(500);

        builder.Property(c => c.CreatedAt)
            .HasColumnName("ngayTao")
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(c => c.UpdatedAt)
            .HasColumnName("ngayCapNhat");

        builder.Property(c => c.DeletedAt)
            .HasColumnName("ngayXoa");

        // Add check constraint for join code
        builder.ToTable(tb => tb.HasCheckConstraint("CK_LopHoc_maLop", "LEN(maLop) = 8"));

        // Unique constraint on JoinCode
        builder.HasIndex(c => c.JoinCode).IsUnique();

        // Foreign key to User (Teacher)
        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(c => c.TeacherId)
            .OnDelete(DeleteBehavior.Restrict);

        // Relationships to child entities
        builder.HasMany<global::Domain.Aggregates.ClassAggregate.Entities.ClassMember>()
            .WithOne()
            .HasForeignKey(cm => cm.ClassId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany<global::Domain.Aggregates.ClassAggregate.Entities.Homework>()
            .WithOne()
            .HasForeignKey(h => h.ClassId)
            .OnDelete(DeleteBehavior.Cascade);

        // Indexes
        builder.HasIndex(c => c.TeacherId);
        builder.HasIndex(c => c.DeletedAt);
    }
}

