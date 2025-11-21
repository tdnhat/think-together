using Domain.Aggregates.GamingAggregate.Entities;
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
            .ValueGeneratedNever();

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
            .IsRequired()
            .HasDefaultValue(0);

        builder.Property(gq => gq.WrongAnswerCount)
            .HasColumnName("soTraLoiSai")
            .IsRequired()
            .HasDefaultValue(0);

        builder.Property(gq => gq.AverageResponseTimeMs)
            .HasColumnName("thoiGianTraLoiTrungBinh")
            .IsRequired()
            .HasDefaultValue(0m)
            .HasPrecision(10, 2);

        builder.Property(gq => gq.CreatedAt)
            .HasColumnName("ngayTao")
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(gq => gq.UpdatedAt)
            .HasColumnName("ngayCapNhat");

        builder.Property(gq => gq.DeletedAt)
            .HasColumnName("ngayXoa");

        // Add check constraints
        builder.ToTable(tb =>
        {
            tb.HasCheckConstraint("CK_CauHoiPhienChoi_viTriTrongPhien", "viTriTrongPhien >= 0");
            tb.HasCheckConstraint("CK_CauHoiPhienChoi_soTraLoiDung", "soTraLoiDung >= 0");
            tb.HasCheckConstraint("CK_CauHoiPhienChoi_soTraLoiSai", "soTraLoiSai >= 0");
            tb.HasCheckConstraint("CK_CauHoiPhienChoi_thoiGian", "thoiGianTraLoiTrungBinh >= 0");
        });

        // Foreign keys - explicitly configure without navigation properties
        builder.HasOne<Domain.Aggregates.GamingAggregate.GameSession>()
            .WithMany()
            .HasForeignKey("GameSessionId")
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne<Domain.Aggregates.QuizAggregate.Entities.Question>()
            .WithMany()
            .HasForeignKey("QuestionId")
            .OnDelete(DeleteBehavior.Restrict);

        // Indexes and unique constraint
        builder.HasIndex(gq => gq.GameSessionId);
        builder.HasIndex(gq => gq.QuestionId);
        builder.HasIndex(gq => new { gq.GameSessionId, gq.PositionInGame }).IsUnique();
        builder.HasIndex(gq => gq.DeletedAt);
    }
}

