using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Entities;

namespace ThinkTogether.Infrastructure.Persistence.Configurations;

public class ChallengeAnswerConfiguration : IEntityTypeConfiguration<ChallengeAnswer>
{
    public void Configure(EntityTypeBuilder<ChallengeAnswer> builder)
    {
        builder.ToTable("CauTraLoiThachThuc");

        builder.HasKey(ca => ca.Id);

        builder.Property(ca => ca.Id)
            .HasColumnName("idCauTraLoi")
            .ValueGeneratedNever();

        builder.Property(ca => ca.ChallengeAttemptId)
            .HasColumnName("idLuotChoiThachThuc")
            .IsRequired();

        builder.Property(ca => ca.QuestionId)
            .HasColumnName("idCauHoi")
            .IsRequired();

        builder.Property(ca => ca.SubmissionTimeMs)
            .HasColumnName("thoiGianNopMs")
            .IsRequired()
            .HasDefaultValue(0);

        builder.Property(ca => ca.IsCorrect)
            .HasColumnName("dung")
            .IsRequired();

        builder.Property(ca => ca.PointsEarned)
            .HasColumnName("diemDat")
            .IsRequired()
            .HasDefaultValue(0);

        // Store answer data as JSON
        builder.Property(ca => ca.SelectedOptionIndexes)
            .HasColumnName("cacChiSoPhuongAnDaChon")
            .HasConversion(
                v => SerializeIntList(v),
                v => DeserializeIntList(v),
                new ValueComparer<IReadOnlyList<int>>(
                    (c1, c2) => c1!.SequenceEqual(c2!),
                    c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                    c => c.ToList()))
            .HasColumnType("nvarchar(max)");

        builder.Property(ca => ca.MatchingPairs)
            .HasColumnName("cacCapGhep")
            .HasConversion(
                v => SerializeMatchingPairs(v),
                v => DeserializeMatchingPairs(v),
                new ValueComparer<IReadOnlyList<AnswerMatchingPair>>(
                    (c1, c2) => c1!.SequenceEqual(c2!),
                    c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                    c => c.ToList()))
            .HasColumnType("nvarchar(max)");

        builder.Property(ca => ca.OrderingItems)
            .HasColumnName("cacMucSapXep")
            .HasConversion(
                v => SerializeOrderingItems(v),
                v => DeserializeOrderingItems(v),
                new ValueComparer<IReadOnlyList<AnswerOrderingItem>>(
                    (c1, c2) => c1!.SequenceEqual(c2!),
                    c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                    c => c.ToList()))
            .HasColumnType("nvarchar(max)");

        builder.Property(ca => ca.CreatedAt)
            .HasColumnName("ngayTao")
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(ca => ca.UpdatedAt)
            .HasColumnName("ngayCapNhat");

        builder.Property(ca => ca.DeletedAt)
            .HasColumnName("ngayXoa");

        // Add check constraints
        builder.ToTable(tb =>
        {
            tb.HasCheckConstraint("CK_CauTraLoiThachThuc_thoiGianNopMs",
                "thoiGianNopMs >= 0");
            tb.HasCheckConstraint("CK_CauTraLoiThachThuc_diemDat", "diemDat >= 0");
        });

        // Note: Foreign key to ChallengeAttempt is defined in ChallengeAttemptConfiguration using navigation property

        // Foreign key to Question
        builder.HasOne<ThinkTogether.Domain.Aggregates.QuizSetAggregate.Entities.Question>()
            .WithMany()
            .HasForeignKey(ca => ca.QuestionId)
            .OnDelete(DeleteBehavior.Restrict);

        // Indexes
        builder.HasIndex(ca => ca.ChallengeAttemptId);
        builder.HasIndex(ca => ca.QuestionId);
        builder.HasIndex(ca => new { ca.ChallengeAttemptId, ca.QuestionId }).IsUnique();
        builder.HasIndex(ca => ca.DeletedAt);
    }

    private static string SerializeIntList(IReadOnlyList<int> value)
    {
        return System.Text.Json.JsonSerializer.Serialize(value);
    }

    private static IReadOnlyList<int> DeserializeIntList(string value)
    {
        return System.Text.Json.JsonSerializer.Deserialize<List<int>>(value) ?? new List<int>();
    }

    private static string SerializeMatchingPairs(IReadOnlyList<AnswerMatchingPair> value)
    {
        return System.Text.Json.JsonSerializer.Serialize(value);
    }

    private static IReadOnlyList<AnswerMatchingPair> DeserializeMatchingPairs(string value)
    {
        return System.Text.Json.JsonSerializer.Deserialize<List<AnswerMatchingPair>>(value) ?? new List<AnswerMatchingPair>();
    }

    private static string SerializeOrderingItems(IReadOnlyList<AnswerOrderingItem> value)
    {
        return System.Text.Json.JsonSerializer.Serialize(value);
    }

    private static IReadOnlyList<AnswerOrderingItem> DeserializeOrderingItems(string value)
    {
        return System.Text.Json.JsonSerializer.Deserialize<List<AnswerOrderingItem>>(value) ?? new List<AnswerOrderingItem>();
    }
}

