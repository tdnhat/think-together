using Domain.Aggregates.GameSessionAggregate.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class GameScoreConfiguration : IEntityTypeConfiguration<GameScore>
{
    public void Configure(EntityTypeBuilder<GameScore> builder)
    {
        builder.ToTable("DiemPhienChoi");
        builder.HasKey(gs => gs.Id);

        builder.Property(gs => gs.Id)
            .HasColumnName("idDiem")
            .ValueGeneratedOnAdd();

        builder.Property(gs => gs.PlayerId)
            .HasColumnName("idNguoiChoi")
            .IsRequired();

        builder.Property(gs => gs.GameSessionId)
            .HasColumnName("idPhienChoi")
            .IsRequired();

        builder.Property(gs => gs.TotalScore)
            .HasColumnName("tongDiem")
            .HasDefaultValue(0);

        builder.Property(gs => gs.FinalRank)
            .HasColumnName("xepHangCuoi");

        builder.Property(gs => gs.CorrectAnswers)
            .HasColumnName("soCauDung")
            .HasDefaultValue(0);

        builder.Property(gs => gs.TotalQuestions)
            .HasColumnName("tongSoCau")
            .HasDefaultValue(0);

        builder.Property(gs => gs.AccuracyPercentage)
            .HasColumnName("tiLeChinhXac")
            .HasDefaultValue(0.0);

        builder.Property(gs => gs.CreatedAt)
            .HasColumnName("ngayTao")
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(gs => gs.UpdatedAt)
            .HasColumnName("ngayCapNhat");

        builder.Property(gs => gs.DeletedAt)
            .HasColumnName("ngayXoa");

        // Indexes
        builder.HasIndex(gs => gs.PlayerId).IsUnique();
        builder.HasIndex(gs => gs.GameSessionId);
        builder.HasIndex(gs => new { gs.GameSessionId, gs.FinalRank });
        builder.HasIndex(gs => gs.TotalScore).IsDescending();
        builder.HasIndex(gs => gs.DeletedAt);
    }
}
