using Domain.Aggregates.QuizSetAggregate.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class QuestionStatisticsConfiguration : IEntityTypeConfiguration<QuestionStatistics>
{
    public void Configure(EntityTypeBuilder<QuestionStatistics> builder)
    {
        builder.ToTable("ThongKeCauHoi");
        builder.HasKey(qs => qs.Id);

        builder.Property(qs => qs.Id)
            .HasColumnName("idThongKe")
            .ValueGeneratedOnAdd();

        builder.Property(qs => qs.GameSessionId)
            .HasColumnName("idPhienChoi")
            .IsRequired();

        builder.Property(qs => qs.QuestionId)
            .HasColumnName("idCauHoi")
            .IsRequired();

        builder.Property(qs => qs.CorrectCount)
            .HasColumnName("soTraLoiDung")
            .HasDefaultValue(0);

        builder.Property(qs => qs.IncorrectCount)
            .HasColumnName("soTraLoiSai")
            .HasDefaultValue(0);

        builder.Property(qs => qs.AverageResponseTimeSeconds)
            .HasColumnName("thoiGianTraLoiTrungBinh")
            .HasDefaultValue(0.0);

        builder.Property(qs => qs.DifficultyPercentage)
            .HasColumnName("tiLeKho")
            .HasDefaultValue(0.0);

        builder.Property(qs => qs.MostSelectedAnswer)
            .HasColumnName("cauTraLoiDuocChonNhieu")
            .HasMaxLength(-1);

        builder.Property(qs => qs.CreatedAt)
            .HasColumnName("ngayTao")
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(qs => qs.UpdatedAt)
            .HasColumnName("ngayCapNhat");

        builder.Property(qs => qs.DeletedAt)
            .HasColumnName("ngayXoa");

        // Indexes
        builder.HasIndex(qs => qs.GameSessionId);
        builder.HasIndex(qs => qs.QuestionId);
        builder.HasIndex(qs => new { qs.GameSessionId, qs.QuestionId }).IsUnique();
        builder.HasIndex(qs => qs.DeletedAt);
    }
}
