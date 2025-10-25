using Domain.Aggregates.GameSessionAggregate.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class PlayerAnswerConfiguration : IEntityTypeConfiguration<PlayerAnswer>
{
    public void Configure(EntityTypeBuilder<PlayerAnswer> builder)
    {
        builder.ToTable("CauTraLoiNguoiChoi");
        builder.HasKey(a => a.Id);

        builder.Property(a => a.Id)
            .HasColumnName("idCauTraLoi")
            .ValueGeneratedNever(); // Application generates the ID

        builder.Property(a => a.GamePlayerId)
            .HasColumnName("idNguoiChoi")
            .IsRequired();

        builder.Property(a => a.QuestionId)
            .HasColumnName("idCauHoi")
            .IsRequired();

        builder.Property(a => a.Answer)
            .HasColumnName("noiDungTraLoi")
            .HasMaxLength(-1);

        builder.Property(a => a.IsCorrect)
            .HasColumnName("dung");

        builder.Property(a => a.PointsEarned)
            .HasColumnName("diemDat")
            .HasDefaultValue(0);

        builder.Property(a => a.CreatedAt)
            .HasColumnName("ngayTao")
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(a => a.UpdatedAt)
            .HasColumnName("ngayCapNhat");

        builder.Property(a => a.DeletedAt)
            .HasColumnName("ngayXoa");

        // Indexes
        builder.HasIndex(a => a.GamePlayerId);
        builder.HasIndex(a => a.QuestionId);
        builder.HasIndex(a => a.DeletedAt);
    }
}
