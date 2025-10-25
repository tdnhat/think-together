using Domain.Aggregates.GameSessionAggregate.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class GamePlayerConfiguration : IEntityTypeConfiguration<GamePlayer>
{
    public void Configure(EntityTypeBuilder<GamePlayer> builder)
    {
        builder.ToTable("NguoiChoiPhien");
        builder.HasKey(p => p.Id);

        builder.Property(p => p.Id)
            .HasColumnName("idNguoiChoi")
            .ValueGeneratedNever(); // Application generates the ID

        builder.Property(p => p.GameSessionId)
            .HasColumnName("idPhienChoi")
            .IsRequired();

        builder.OwnsOne(p => p.Nickname, nn =>
        {
            nn.Property(n => n.Value)
                .HasColumnName("thamDuOi")
                .IsRequired()
                .HasMaxLength(100);
        });

        builder.OwnsOne(p => p.Score, score =>
        {
            score.Property(s => s.Value)
                .HasColumnName("diem")
                .HasDefaultValue(0);
        });

        builder.Property(p => p.Rank)
            .HasColumnName("xepHang");

        builder.Property(p => p.ConnectionStatus)
            .HasColumnName("trangThaiKetNoi")
            .HasConversion<string>();

        builder.Property(p => p.CreatedAt)
            .HasColumnName("ngayTao")
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(p => p.UpdatedAt)
            .HasColumnName("ngayCapNhat");

        builder.Property(p => p.DeletedAt)
            .HasColumnName("ngayXoa");

        // Indexes
        builder.HasIndex(p => p.GameSessionId);
        builder.HasIndex(p => p.Rank);
        builder.HasIndex(p => p.DeletedAt);
    }
}
