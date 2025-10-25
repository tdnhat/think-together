using Domain.Aggregates.GameSessionAggregate;
using Domain.Aggregates.GameSessionAggregate.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class GameSessionConfiguration : IEntityTypeConfiguration<GameSession>
{
    public void Configure(EntityTypeBuilder<GameSession> builder)
    {
        builder.ToTable("PhienChoi");
        builder.HasKey(g => g.Id);

        // Properties with Vietnamese column names
        builder.Property(g => g.Id)
        .HasColumnName("idPhienChoi")
        .ValueGeneratedNever(); // Application generates the ID

        builder.Property(g => g.HostId)
        .HasColumnName("idChuPhong")
        .IsRequired();

        builder.Property(g => g.QuizSetId)
        .HasColumnName("idBoTrucNghiem")
        .IsRequired();

        builder.OwnsOne(g => g.PIN, pin =>
        {
            pin.Property(p => p.Value)
                .HasColumnName("maPIN")
                .IsRequired()
                .HasMaxLength(6);
        });

        builder.Property(g => g.Status)
            .HasColumnName("trangThai")
            .IsRequired()
            .HasConversion<string>();

        builder.Property(g => g.CurrentQuestionIndex)
            .HasColumnName("cauHoiHienTai")
            .HasDefaultValue(0);

        builder.Property(g => g.StartedAt)
            .HasColumnName("thoiGianBatDau");

        builder.Property(g => g.EndedAt)
            .HasColumnName("thoiGianKetThuc");

        builder.Property(g => g.CreatedAt)
            .HasColumnName("ngayTao")
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(g => g.UpdatedAt)
            .HasColumnName("ngayCapNhat");

        builder.Property(g => g.DeletedAt)
        .HasColumnName("ngayXoa");

        // Indexes
        builder.HasIndex(g => g.HostId);
        builder.HasIndex(g => g.QuizSetId);
        builder.HasIndex(g => g.Status);
        builder.HasIndex(g => g.DeletedAt);
        }
}
