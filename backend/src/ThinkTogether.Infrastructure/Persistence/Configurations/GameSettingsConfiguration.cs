using Domain.Aggregates.GameSessionAggregate.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;
public class GameSettingsConfiguration : IEntityTypeConfiguration<GameSettings>
{
    public void Configure(EntityTypeBuilder<GameSettings> builder)
    {
        builder.ToTable("CaiDatPhienChoi");
        builder.HasKey(g => g.Id);

        builder.Property(g => g.Id)
            .HasColumnName("idCaiDat")
            .ValueGeneratedOnAdd();

        builder.Property(g => g.GameSessionId)
            .HasColumnName("idPhienChoi")
            .IsRequired();

        builder.Property(g => g.ShuffleQuestions)
            .HasColumnName("xaoTronCauHoi")
            .HasDefaultValue(false);

        builder.Property(g => g.ShuffleAnswers)
            .HasColumnName("xaoTronCauTraLoi")
            .HasDefaultValue(false);

        builder.Property(g => g.ShowLeaderboard)
            .HasColumnName("hienThiBangXepHang")
            .HasDefaultValue(true);

        builder.Property(g => g.ShowCorrectAnswers)
            .HasColumnName("hienThiDapAnDung")
            .HasDefaultValue(true);

        builder.Property(g => g.CreatedAt)
            .HasColumnName("ngayTao")
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(g => g.UpdatedAt)
            .HasColumnName("ngayCapNhat");

        builder.Property(g => g.DeletedAt)
            .HasColumnName("ngayXoa");

        // Indexes
        builder.HasIndex(g => g.GameSessionId);
        builder.HasIndex(g => g.DeletedAt);
    }
}
