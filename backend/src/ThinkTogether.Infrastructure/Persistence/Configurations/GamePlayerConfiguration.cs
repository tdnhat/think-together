using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Entities;

namespace ThinkTogether.Infrastructure.Persistence.Configurations;

public class GamePlayerConfiguration : IEntityTypeConfiguration<GamePlayer>
{
    public void Configure(EntityTypeBuilder<GamePlayer> builder)
    {
        builder.ToTable("NguoiChoiPhien");

        builder.HasKey(gp => gp.Id);

        builder.Property(gp => gp.Id)
            .HasColumnName("idNguoiChoi")
            .ValueGeneratedNever();

        builder.Property(gp => gp.GameSessionId)
            .HasColumnName("idPhienChoi")
            .IsRequired();

        builder.Property(gp => gp.Nickname)
            .HasColumnName("bietDanh")
            .IsRequired()
            .HasMaxLength(100);

        // Store ConnectionStatus enum as integer
        builder.Property(gp => gp.ConnectionStatus)
            .HasColumnName("trangThaiKetNoi")
            .IsRequired()
            .HasConversion<int>();

        builder.Property(gp => gp.ConnectionId)
            .HasColumnName("idKetNoi")
            .HasMaxLength(100);

        builder.Property(gp => gp.CreatedAt)
            .HasColumnName("ngayTao")
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(gp => gp.UpdatedAt)
            .HasColumnName("ngayCapNhat");

        builder.Property(gp => gp.DeletedAt)
            .HasColumnName("ngayXoa");

        // Add check constraints
        builder.ToTable(tb =>
        {
            tb.HasCheckConstraint("CK_NguoiChoiPhien_trangThaiKetNoi",
                "trangThaiKetNoi IN (1, 2)");
            tb.HasCheckConstraint("CK_NguoiChoiPhien_bietDanh",
                "LEN(bietDanh) >= 2 AND LEN(bietDanh) <= 100");
        });

        // Navigation property - answers
        builder.HasMany(gp => gp.Answers)
            .WithOne()
            .HasForeignKey(pa => pa.GamePlayerId)
            .OnDelete(DeleteBehavior.Cascade);

        // Indexes
        builder.HasIndex(gp => gp.GameSessionId);
        builder.HasIndex(gp => gp.DeletedAt);
        builder.HasIndex(gp => new { gp.GameSessionId, gp.CreatedAt });
    }
}

