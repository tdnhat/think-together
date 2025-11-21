using Domain.Aggregates.QuizAggregate.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class QuestionConfiguration : IEntityTypeConfiguration<Question>
{
    public void Configure(EntityTypeBuilder<Question> builder)
    {
        builder.ToTable("CauHoi");

        builder.HasKey(q => q.Id);

        builder.Property(q => q.Id)
            .HasColumnName("idCauHoi")
            .ValueGeneratedNever();

        builder.Property(q => q.QuizSetId)
            .HasColumnName("idBoTracNghiem")
            .IsRequired();

        builder.Property(q => q.Content)
            .HasColumnName("noiDung")
            .IsRequired()
            .HasMaxLength(2000);

        builder.Property(q => q.Type)
            .HasColumnName("loaiCauHoi")
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(q => q.TimeLimit)
            .HasColumnName("giuiHanThoiGian")
            .IsRequired()
            .HasDefaultValue(30);

        builder.Property(q => q.DisplayOrder)
            .HasColumnName("thuTu")
            .IsRequired()
            .HasDefaultValue(0);

        builder.Property(q => q.CreatedAt)
            .HasColumnName("ngayTao")
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(q => q.UpdatedAt)
            .HasColumnName("ngayCapNhat");

        builder.Property(q => q.DeletedAt)
            .HasColumnName("ngayXoa");

        // Add check constraint for enum values
        builder.ToTable(tb => tb.HasCheckConstraint(
            "CK_CauHoi_loaiCauHoi",
            "loaiCauHoi IN ('SingleChoice', 'TrueFalse', 'MultipleChoice', 'Matching', 'Ordering', 'Video')"));

        // Add check constraint for time limit
        builder.ToTable(tb => tb.HasCheckConstraint(
            "CK_CauHoi_giuiHanThoiGian",
            "giuiHanThoiGian > 0 AND giuiHanThoiGian <= 300"));

        // Add check constraint for display order
        builder.ToTable(tb => tb.HasCheckConstraint(
            "CK_CauHoi_thuTu",
            "thuTu >= 0"));

        // Foreign key to QuizSet - explicitly configure without navigation properties
        builder.HasOne<Domain.Aggregates.QuizAggregate.QuizSet>()
            .WithMany()
            .HasForeignKey("QuizSetId")
            .OnDelete(DeleteBehavior.Cascade);

        // Indexes
        builder.HasIndex(q => q.QuizSetId);
        builder.HasIndex(q => q.DisplayOrder);
        builder.HasIndex(q => q.DeletedAt);
        builder.HasIndex(q => new { q.QuizSetId, q.DisplayOrder }).HasFilter("ngayXoa IS NULL");
    }
}

