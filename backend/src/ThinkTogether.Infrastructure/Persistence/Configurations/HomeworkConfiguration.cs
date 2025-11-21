using Domain.Aggregates.ClassAggregate.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class HomeworkConfiguration : IEntityTypeConfiguration<Homework>
{
    public void Configure(EntityTypeBuilder<Homework> builder)
    {
        builder.ToTable("BaiTapVeNha");

        builder.HasKey(h => h.Id);

        builder.Property(h => h.Id)
            .HasColumnName("idBaiTapVeNha")
            .ValueGeneratedNever();

        builder.Property(h => h.ClassId)
            .HasColumnName("idLopHoc")
            .IsRequired();

        builder.Property(h => h.QuizSetId)
            .HasColumnName("idBoTracNghiem")
            .IsRequired();

        builder.Property(h => h.Title)
            .HasColumnName("tieuDe")
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(h => h.DueDate)
            .HasColumnName("hanChot");

        builder.Property(h => h.AssignedAt)
            .HasColumnName("ngayGiao")
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(h => h.CreatedAt)
            .HasColumnName("ngayTao")
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(h => h.UpdatedAt)
            .HasColumnName("ngayCapNhat");

        builder.Property(h => h.DeletedAt)
            .HasColumnName("ngayXoa");

        // Add check constraint
        builder.ToTable(tb => tb.HasCheckConstraint(
            "CK_BaiTapVeNha_hanChot",
            "hanChot IS NULL OR hanChot >= ngayGiao"));

        // Foreign keys - explicitly configure without navigation properties
        builder.HasOne<Domain.Aggregates.ClassAggregate.Class>()
            .WithMany()
            .HasForeignKey("ClassId")
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne<Domain.Aggregates.QuizAggregate.QuizSet>()
            .WithMany()
            .HasForeignKey("QuizSetId")
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany<HomeworkSubmission>()
            .WithOne()
            .HasForeignKey("HomeworkId")
            .OnDelete(DeleteBehavior.Cascade);

        // Indexes
        builder.HasIndex(h => h.ClassId);
        builder.HasIndex(h => h.QuizSetId);
        builder.HasIndex(h => h.DueDate);
        builder.HasIndex(h => new { h.ClassId, h.DueDate });
        builder.HasIndex(h => h.DeletedAt);
    }
}

