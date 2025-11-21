using Domain.Aggregates.QuizAggregate.ValueObjects;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class QuestionOptionConfiguration : IEntityTypeConfiguration<QuestionOption>
{
    public void Configure(EntityTypeBuilder<QuestionOption> builder)
    {
        builder.ToTable("CauHoi_TracNghiem");

        builder.HasKey(qo => new { qo.Content, qo.DisplayOrder });

        builder.Property(qo => qo.Content)
            .HasColumnName("noiDung")
            .IsRequired()
            .HasMaxLength(1000);

        builder.Property(qo => qo.IsCorrect)
            .HasColumnName("laDapAnDung")
            .IsRequired();

        builder.Property(qo => qo.DisplayOrder)
            .HasColumnName("thuTu")
            .IsRequired();

        builder.Property(qo => qo.ImageUrl)
            .HasColumnName("urlAnh")
            .HasMaxLength(500);

        // Add check constraint for display order
        builder.ToTable(tb => tb.HasCheckConstraint(
            "CK_CauHoi_TracNghiem_thuTu",
            "thuTu >= 0"));
    }
}

