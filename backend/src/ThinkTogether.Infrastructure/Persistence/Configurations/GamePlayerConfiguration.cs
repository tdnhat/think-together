using Domain.Aggregates.GamingAggregate.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

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

        builder.Property(gp => gp.ConnectionStatus)
            .HasColumnName("trangThaiKetNoi")
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(20);

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
                "trangThaiKetNoi IN ('Connected', 'Disconnected')");
            tb.HasCheckConstraint("CK_NguoiChoiPhien_bietDanh",
                "LEN(bietDanh) >= 2 AND LEN(bietDanh) <= 100");
        });

        // Foreign key - explicitly configure without navigation properties
        builder.HasOne<Domain.Aggregates.GamingAggregate.GameSession>()
            .WithMany()
            .HasForeignKey("GameSessionId")
            .OnDelete(DeleteBehavior.Cascade);

        // Indexes
        builder.HasIndex(gp => gp.GameSessionId);
        builder.HasIndex(gp => gp.DeletedAt);
        builder.HasIndex(gp => new { gp.GameSessionId, gp.CreatedAt });
    }
}

