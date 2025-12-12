using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Entities;

namespace ThinkTogether.Infrastructure.Persistence.Configurations;

public class GameScoreConfiguration : IEntityTypeConfiguration<GameScore>
{
    public void Configure(EntityTypeBuilder<GameScore> builder)
    {
        builder.ToTable("DiemPhienChoi");

        builder.HasKey(gs => gs.Id);

        builder.Property(gs => gs.Id)
            .HasColumnName("idDiem")
            .ValueGeneratedNever();

        builder.Property(gs => gs.GameSessionId)
            .HasColumnName("idPhienChoi")
            .IsRequired();

        builder.Property(gs => gs.GamePlayerId)
            .HasColumnName("idNguoiChoi")
            .IsRequired();

        builder.Property(gs => gs.TotalPoints)
            .HasColumnName("tongDiem")
            .IsRequired()
            .HasDefaultValue(0);

        builder.Property(gs => gs.FinalRank)
            .HasColumnName("xepHangCuoi");

        builder.Property(gs => gs.CorrectAnswers)
            .HasColumnName("soCauDung")
            .IsRequired()
            .HasDefaultValue(0);

        builder.Property(gs => gs.TotalQuestions)
            .HasColumnName("tongSoCau")
            .IsRequired()
            .HasDefaultValue(0);

        builder.Property(gs => gs.AccuracyPercentage)
            .HasColumnName("tiLeChinhXac")
            .IsRequired()
            .HasDefaultValue(0m)
            .HasPrecision(5, 2);

        builder.Property(gs => gs.CreatedAt)
            .HasColumnName("ngayTao")
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(gs => gs.UpdatedAt)
            .HasColumnName("ngayCapNhat");

        builder.Property(gs => gs.DeletedAt)
            .HasColumnName("ngayXoa");

        // Add check constraints
        builder.ToTable(tb =>
        {
            tb.HasCheckConstraint("CK_DiemPhienChoi_tongDiem", "tongDiem >= 0");
            tb.HasCheckConstraint("CK_DiemPhienChoi_soCauDung",
                "soCauDung >= 0 AND soCauDung <= tongSoCau");
            tb.HasCheckConstraint("CK_DiemPhienChoi_tongSoCau", "tongSoCau >= 0");
            tb.HasCheckConstraint("CK_DiemPhienChoi_tiLeChinhXac",
                "tiLeChinhXac >= 0 AND tiLeChinhXac <= 100");
            tb.HasCheckConstraint("CK_DiemPhienChoi_xepHangCuoi",
                "xepHangCuoi IS NULL OR xepHangCuoi > 0");
        });

        // Unique constraint on GamePlayerId
        builder.HasIndex(gs => gs.GamePlayerId).IsUnique();

        // Note: Foreign key to GameSession is defined in GameSessionConfiguration using navigation property

        // NO ACTION to avoid multiple cascade paths (GameSession -> GamePlayer -> GameScore)
        builder.HasOne<Domain.Aggregates.GamingAggregate.Entities.GamePlayer>()
            .WithMany()
            .HasForeignKey(gs => gs.GamePlayerId)
            .OnDelete(DeleteBehavior.NoAction);

        // Indexes
        builder.HasIndex(gs => gs.GameSessionId);
        builder.HasIndex(gs => new { gs.GameSessionId, gs.FinalRank });
        builder.HasIndex(gs => new { gs.GameSessionId, gs.TotalPoints });
        builder.HasIndex(gs => gs.DeletedAt);
    }
}

