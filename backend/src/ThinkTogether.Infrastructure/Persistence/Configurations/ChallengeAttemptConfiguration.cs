using Domain.Aggregates.ChallengeAggregate.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class ChallengeAttemptConfiguration : IEntityTypeConfiguration<ChallengeAttempt>
{
    public void Configure(EntityTypeBuilder<ChallengeAttempt> builder)
    {
        builder.ToTable("LuotChoiThachThuc");
        builder.HasKey(a => a.Id);

        builder.Property(a => a.Id)
            .HasColumnName("idLuotChoi")
            .ValueGeneratedNever(); // Application generates the ID

        builder.Property(a => a.ChallengeId)
            .HasColumnName("idThachThuc")
            .IsRequired();

        builder.Property(a => a.StudentName)
            .HasColumnName("tenHocSinh")
            .IsRequired()
            .HasMaxLength(255);

        builder.OwnsOne(a => a.Score, score =>
        {
            score.Property(s => s.Value)
                .HasColumnName("diemDat")
                .HasDefaultValue(0);
        });

        builder.Property(a => a.CompletionTime)
            .HasColumnName("thoiGianHoanThanh");

        builder.Property(a => a.CorrectAnswers)
            .HasColumnName("soCauDung")
            .HasDefaultValue(0);

        builder.Property(a => a.CompletedAt)
            .HasColumnName("thoiGianHoanTatLuot")
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(a => a.CreatedAt)
            .HasColumnName("ngayTao")
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(a => a.UpdatedAt)
            .HasColumnName("ngayCapNhat");

        builder.Property(a => a.DeletedAt)
            .HasColumnName("ngayXoa");

        // Indexes
        builder.HasIndex(a => a.ChallengeId);
        builder.HasIndex(a => a.StudentName);
        builder.HasIndex(a => a.CompletedAt);
        builder.HasIndex(a => a.DeletedAt);
    }
}
