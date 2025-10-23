using Domain.Aggregates.GameSessionAggregate.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class GameQuestionConfiguration : IEntityTypeConfiguration<GameQuestion>
{
    public void Configure(EntityTypeBuilder<GameQuestion> builder)
    {
        builder.ToTable("CauHoiPhienChoi");
        builder.HasKey(gq => gq.Id);

        builder.Property(gq => gq.Id)
            .HasColumnName("idCauHoiPhien")
            .ValueGeneratedOnAdd();

        builder.Property(gq => gq.GameSessionId)
            .HasColumnName("idPhienChoi")
            .IsRequired();

        builder.Property(gq => gq.QuestionId)
            .HasColumnName("idCauHoi")
            .IsRequired();

        builder.Property(gq => gq.PositionInGame)
            .HasColumnName("viTriTrongPhien")
            .IsRequired();

        builder.Property(gq => gq.CorrectAnswerCount)
            .HasColumnName("soTraLoiDung")
            .HasDefaultValue(0);

        builder.Property(gq => gq.IncorrectAnswerCount)
            .HasColumnName("soTraLoiSai")
            .HasDefaultValue(0);

        builder.Property(gq => gq.AverageResponseTimeSeconds)
            .HasColumnName("thoiGianTraLoiTrungBinh")
            .HasDefaultValue(0.0);

        builder.Property(gq => gq.CreatedAt)
            .HasColumnName("ngayTao")
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(gq => gq.UpdatedAt)
            .HasColumnName("ngayCapNhat");

        builder.Property(gq => gq.DeletedAt)
            .HasColumnName("ngayXoa");

        // Indexes
        builder.HasIndex(gq => gq.GameSessionId);
        builder.HasIndex(gq => gq.QuestionId);
        builder.HasIndex(gq => new { gq.GameSessionId, gq.PositionInGame });
        builder.HasIndex(gq => gq.DeletedAt);
    }
}
