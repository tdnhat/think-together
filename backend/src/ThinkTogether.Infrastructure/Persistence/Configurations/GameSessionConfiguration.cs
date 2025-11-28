using Domain.Aggregates.GamingAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ThinkTogether.Domain.Aggregates.UserAggregate;

namespace ThinkTogether.Infrastructure.Persistence.Configurations;

public class GameSessionConfiguration : IEntityTypeConfiguration<GameSession>
{
    public void Configure(EntityTypeBuilder<GameSession> builder)
    {
        builder.ToTable("PhienChoi");

        builder.HasKey(gs => gs.Id);

        builder.Property(gs => gs.Id)
            .HasColumnName("idPhienChoi")
            .ValueGeneratedNever();

        builder.Property(gs => gs.HostUserId)
            .HasColumnName("idChuPhong")
            .IsRequired();

        builder.Property(gs => gs.QuizSetId)
            .HasColumnName("idBoTracNghiem")
            .IsRequired();

        builder.Property(gs => gs.PIN)
            .HasColumnName("maPIN")
            .IsRequired()
            .HasMaxLength(6);

        builder.Property(gs => gs.Status)
            .HasColumnName("trangThai")
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.Property(gs => gs.CurrentQuestionIndex)
            .HasColumnName("cauHoiHienTai")
            .IsRequired()
            .HasDefaultValue(0);

        builder.Property(gs => gs.StartedAt)
            .HasColumnName("thoiGianBatDau");

        builder.Property(gs => gs.EndedAt)
            .HasColumnName("thoiGianKetThuc");

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
            tb.HasCheckConstraint("CK_PhienChoi_trangThai", 
                "trangThai IN ('Waiting', 'Started', 'Ended')");
            tb.HasCheckConstraint("CK_PhienChoi_maPIN", 
                "LEN(maPIN) = 6 AND maPIN LIKE '[0-9][0-9][0-9][0-9][0-9][0-9]'");
            tb.HasCheckConstraint("CK_PhienChoi_cauHoiHienTai", 
                "cauHoiHienTai >= 0");
            tb.HasCheckConstraint("CK_PhienChoi_thoiGian", 
                "thoiGianKetThuc IS NULL OR thoiGianKetThuc >= thoiGianBatDau");
        });

        // Relationships
        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(gs => gs.HostUserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<global::ThinkTogether.Domain.Aggregates.QuizSetAggregate.QuizSet>()
            .WithMany()
            .HasForeignKey(gs => gs.QuizSetId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany<global::Domain.Aggregates.GamingAggregate.Entities.GamePlayer>()
            .WithOne()
            .HasForeignKey(gp => gp.GameSessionId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany<global::Domain.Aggregates.GamingAggregate.Entities.GameQuestion>()
            .WithOne()
            .HasForeignKey(gq => gq.GameSessionId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany<global::Domain.Aggregates.GamingAggregate.Entities.GameScore>()
            .WithOne()
            .HasForeignKey(gs => gs.GameSessionId)
            .OnDelete(DeleteBehavior.Cascade);

        // Indexes
        builder.HasIndex(gs => gs.HostUserId);
        builder.HasIndex(gs => gs.QuizSetId);
        builder.HasIndex(gs => gs.Status);
        builder.HasIndex(gs => gs.DeletedAt);
        builder.HasIndex(gs => new { gs.PIN, gs.Status });
    }
}

