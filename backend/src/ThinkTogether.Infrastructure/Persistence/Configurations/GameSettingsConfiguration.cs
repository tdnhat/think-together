using Domain.Aggregates.GamingAggregate.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class GameSettingsConfiguration : IEntityTypeConfiguration<GameSettings>
{
    public void Configure(EntityTypeBuilder<GameSettings> builder)
    {
        builder.ToTable("CaiDatPhienChoi");

        builder.HasKey(gs => gs.Id);

        builder.Property(gs => gs.Id)
            .HasColumnName("idCaiDat")
            .ValueGeneratedNever();

        builder.Property(gs => gs.GameSessionId)
            .HasColumnName("idPhienChoi")
            .IsRequired();

        builder.Property(gs => gs.ShuffleQuestions)
            .HasColumnName("xaoTronCauHoi")
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(gs => gs.ShuffleAnswers)
            .HasColumnName("xaoTronCauTraLoi")
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(gs => gs.ShowLeaderboard)
            .HasColumnName("hienThiBangXepHang")
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(gs => gs.ShowCorrectAnswers)
            .HasColumnName("hienThiDapAnDung")
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(gs => gs.CreatedAt)
            .HasColumnName("ngayTao")
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(gs => gs.UpdatedAt)
            .HasColumnName("ngayCapNhat");

        builder.Property(gs => gs.DeletedAt)
            .HasColumnName("ngayXoa");

        // Unique constraint on GameSessionId
        builder.HasIndex(gs => gs.GameSessionId).IsUnique();

        // Foreign key
        builder.HasOne<Domain.Aggregates.GamingAggregate.GameSession>()
            .WithOne()
            .HasForeignKey<GameSettings>(gs => gs.GameSessionId)
            .OnDelete(DeleteBehavior.Cascade);

        // Index for soft delete
        builder.HasIndex(gs => gs.DeletedAt);
    }
}

