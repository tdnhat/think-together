using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Entities;

namespace ThinkTogether.Infrastructure.Persistence.Configurations;

public class PlayerAnswerConfiguration : IEntityTypeConfiguration<PlayerAnswer>
{
    public void Configure(EntityTypeBuilder<PlayerAnswer> builder)
    {
        builder.ToTable("TraLoiNguoiChoi");

        builder.HasKey(pa => pa.Id);

        builder.Property(pa => pa.Id)
            .HasColumnName("idTraLoi")
            .ValueGeneratedNever();

        builder.Property(pa => pa.GameSessionId)
            .HasColumnName("idPhienChoi")
            .IsRequired();

        builder.Property(pa => pa.GamePlayerId)
            .HasColumnName("idNguoiChoi")
            .IsRequired();

        builder.Property(pa => pa.GameQuestionId)
            .HasColumnName("idCauHoiPhien")
            .IsRequired();

        builder.Property(pa => pa.IsCorrect)
            .HasColumnName("laDapAnDung")
            .IsRequired();

        builder.Property(pa => pa.ResponseTimeMs)
            .HasColumnName("thoiGianMs")
            .IsRequired();

        builder.Property(pa => pa.PointsEarned)
            .HasColumnName("diemNhan")
            .IsRequired()
            .HasDefaultValue(0);

        builder.Property(pa => pa.CreatedAt)
            .HasColumnName("ngayTao")
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(pa => pa.UpdatedAt)
            .HasColumnName("ngayCapNhat");

        builder.Property(pa => pa.DeletedAt)
            .HasColumnName("ngayXoa");

        // Add check constraints
        builder.ToTable(tb =>
        {
            tb.HasCheckConstraint("CK_TraLoiNguoiChoi_thoiGianMs", "thoiGianMs > 0");
            tb.HasCheckConstraint("CK_TraLoiNguoiChoi_diemNhan", "diemNhan >= 0");
        });

        // Foreign key to GameQuestion (GamePlayer FK is defined in GamePlayerConfiguration)
        builder.HasOne<Domain.Aggregates.GamingAggregate.Entities.GameQuestion>()
            .WithMany()
            .HasForeignKey(pa => pa.GameQuestionId)
            .OnDelete(DeleteBehavior.Restrict);

        // Indexes
        builder.HasIndex(pa => pa.GamePlayerId);
        builder.HasIndex(pa => pa.GameQuestionId);
        builder.HasIndex(pa => new { pa.GamePlayerId, pa.GameQuestionId }).IsUnique();
        builder.HasIndex(pa => pa.DeletedAt);
    }
}

