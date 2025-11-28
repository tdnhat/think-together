using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class QuestionStatisticConfiguration : IEntityTypeConfiguration<QuestionStatistic>
{
    public void Configure(EntityTypeBuilder<QuestionStatistic> builder)
    {
        builder.ToTable("ThongKeCauHoi");

        builder.HasKey(qs => qs.Id);

        builder.Property(qs => qs.Id)
            .HasColumnName("idThongKe")
            .ValueGeneratedNever();

        builder.Property(qs => qs.QuestionId)
            .HasColumnName("idCauHoi")
            .IsRequired();

        builder.Property(qs => qs.TimesAsked)
            .HasColumnName("soLanHoi")
            .IsRequired()
            .HasDefaultValue(0);

        builder.Property(qs => qs.CorrectAnswers)
            .HasColumnName("soLanTraLoiDung")
            .IsRequired()
            .HasDefaultValue(0);

        builder.Property(qs => qs.WrongAnswers)
            .HasColumnName("soLanTraLoiSai")
            .IsRequired()
            .HasDefaultValue(0);

        builder.Property(qs => qs.AverageResponseTimeMs)
            .HasColumnName("thoiGianTrungBinhMs")
            .IsRequired()
            .HasDefaultValue(0);

        builder.Property(qs => qs.Difficulty)
            .HasColumnName("doDung")
            .IsRequired()
            .HasDefaultValue(0m)
            .HasPrecision(5, 2);

        builder.Property(qs => qs.CreatedAt)
            .HasColumnName("ngayTao")
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(qs => qs.UpdatedAt)
            .HasColumnName("ngayCapNhat");

        // Add check constraints
        builder.ToTable(tb =>
        {
            tb.HasCheckConstraint("CK_ThongKeCauHoi_soLanHoi", "soLanHoi >= 0");
            tb.HasCheckConstraint("CK_ThongKeCauHoi_soLanTraLoiDung", "soLanTraLoiDung >= 0");
            tb.HasCheckConstraint("CK_ThongKeCauHoi_soLanTraLoiSai", "soLanTraLoiSai >= 0");
            tb.HasCheckConstraint("CK_ThongKeCauHoi_thoiGianTrungBinhMs", "thoiGianTrungBinhMs >= 0");
            tb.HasCheckConstraint("CK_ThongKeCauHoi_doDung", "doDung >= 0 AND doDung <= 100");
        });

        // Unique constraint on QuestionId
        builder.HasIndex(qs => qs.QuestionId).IsUnique();

        // Index on Difficulty
        builder.HasIndex(qs => qs.Difficulty);
    }
}

