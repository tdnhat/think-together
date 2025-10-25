using Domain.Aggregates.ChallengeAggregate.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class ChallengePlayerAnswerConfiguration : IEntityTypeConfiguration<ChallengePlayerAnswer>
{
    public void Configure(EntityTypeBuilder<ChallengePlayerAnswer> builder)
    {
        builder.ToTable("CauTraLoiThachThuc");
        builder.HasKey(cpa => cpa.Id);

        builder.Property(cpa => cpa.Id)
            .HasColumnName("idCauTraLoi")
            .ValueGeneratedNever(); // Application generates the ID

        builder.Property(cpa => cpa.ChallengeSessionId)
            .HasColumnName("idLuotChoiThachThuc")
            .IsRequired();

        builder.Property(cpa => cpa.QuestionId)
            .HasColumnName("idCauHoi")
            .IsRequired();

        builder.Property(cpa => cpa.SubmittedAnswer)
            .HasColumnName("cauTraLoi")
            .HasMaxLength(-1);

        builder.Property(cpa => cpa.SubmissionTimeSeconds)
            .HasColumnName("thoiGianNop")
            .HasDefaultValue(0);

        builder.Property(cpa => cpa.IsCorrect)
            .HasColumnName("dung");

        builder.Property(cpa => cpa.PointsEarned)
            .HasColumnName("diemDat")
            .HasDefaultValue(0);

        builder.Property(cpa => cpa.CreatedAt)
            .HasColumnName("ngayTao")
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(cpa => cpa.UpdatedAt)
            .HasColumnName("ngayCapNhat");

        builder.Property(cpa => cpa.DeletedAt)
            .HasColumnName("ngayXoa");

        // Indexes
        builder.HasIndex(cpa => cpa.ChallengeSessionId);
        builder.HasIndex(cpa => cpa.QuestionId);
        builder.HasIndex(cpa => new { cpa.ChallengeSessionId, cpa.QuestionId });
        builder.HasIndex(cpa => cpa.DeletedAt);
    }
}
