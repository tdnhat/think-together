using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class QuestionConfiguration : IEntityTypeConfiguration<Question>
{
    public void Configure(EntityTypeBuilder<Question> builder)
    {
        builder.ToTable("CauHoi");

        builder.HasKey(q => q.Id);

        builder.Property(q => q.Id)
            .HasColumnName("idCauHoi")
            .ValueGeneratedNever();

        builder.Property(q => q.QuizSetId)
            .HasColumnName("idBoTracNghiem")
            .IsRequired();

        builder.Property(q => q.Content)
            .HasColumnName("noiDung")
            .IsRequired()
            .HasMaxLength(2000);

        builder.Property(q => q.Type)
            .HasColumnName("loaiCauHoi")
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(q => q.TimeLimit)
            .HasColumnName("giuiHanThoiGian")
            .IsRequired()
            .HasDefaultValue(30);

        builder.Property(q => q.DisplayOrder)
            .HasColumnName("thuTu")
            .IsRequired()
            .HasDefaultValue(0);

        builder.Property(q => q.VideoUrl)
            .HasColumnName("urlVideo")
            .HasMaxLength(500);

        builder.Property(q => q.VideoTimestamp)
            .HasColumnName("dauThoiGianVideo");

        builder.Property(q => q.CreatedAt)
            .HasColumnName("ngayTao")
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(q => q.UpdatedAt)
            .HasColumnName("ngayCapNhat");

        builder.Property(q => q.DeletedAt)
            .HasColumnName("ngayXoa");

        // Configure owned entities (value objects)
        builder.OwnsMany(q => q.Options, options =>
        {
            options.ToTable("CauHoi_TracNghiem");
            options.WithOwner().HasForeignKey("idCauHoi");
            options.Property<Guid>("Id").HasColumnName("idPhuongAn");
            options.HasKey("Id");
            
            options.Property(o => o.Content)
                .HasColumnName("noiDung")
                .IsRequired()
                .HasMaxLength(1000);
            
            options.Property(o => o.IsCorrect)
                .HasColumnName("laDapAnDung")
                .IsRequired();
            
            options.Property(o => o.DisplayOrder)
                .HasColumnName("thuTu")
                .IsRequired();
            
            options.Property(o => o.ImageUrl)
                .HasColumnName("urlAnh")
                .HasMaxLength(500);
        });

        builder.OwnsMany(q => q.MatchingPairs, pairs =>
        {
            pairs.ToTable("CauHoi_CapGhep");
            pairs.WithOwner().HasForeignKey("idCauHoi");
            pairs.Property<Guid>("Id").HasColumnName("idMucGhep");
            pairs.HasKey("Id");
            
            pairs.Property(p => p.LeftContent)
                .HasColumnName("noiDungTrai")
                .IsRequired()
                .HasMaxLength(500);
            
            pairs.Property(p => p.RightContent)
                .HasColumnName("noiDungPhai")
                .IsRequired()
                .HasMaxLength(500);
            
            pairs.Property(p => p.DisplayOrder)
                .HasColumnName("thuTu")
                .IsRequired();
        });

        builder.OwnsMany(q => q.OrderingItems, items =>
        {
            items.ToTable("CauHoi_SapXep");
            items.WithOwner().HasForeignKey("idCauHoi");
            items.Property<Guid>("Id").HasColumnName("idMucSapXep");
            items.HasKey("Id");
            
            items.Property(i => i.Content)
                .HasColumnName("noiDung")
                .IsRequired()
                .HasMaxLength(500);
            
            items.Property(i => i.CorrectPosition)
                .HasColumnName("viTriDung")
                .IsRequired();
        });

        // Add check constraint for enum values
        builder.ToTable(tb => tb.HasCheckConstraint(
            "CK_CauHoi_loaiCauHoi",
            "loaiCauHoi IN ('SingleChoice', 'TrueFalse', 'MultipleChoice', 'Matching', 'Ordering', 'Video')"));

        // Add check constraint for time limit
        builder.ToTable(tb => tb.HasCheckConstraint(
            "CK_CauHoi_giuiHanThoiGian",
            "giuiHanThoiGian > 0 AND giuiHanThoiGian <= 300"));

        // Add check constraint for display order
        builder.ToTable(tb => tb.HasCheckConstraint(
            "CK_CauHoi_thuTu",
            "thuTu >= 0"));

        // Foreign key to QuizSet
        builder.HasOne<ThinkTogether.Domain.Aggregates.QuizSetAggregate.QuizSet>()
            .WithMany()
            .HasForeignKey(q => q.QuizSetId)
            .OnDelete(DeleteBehavior.Cascade);

        // Indexes
        builder.HasIndex(q => q.QuizSetId);
        builder.HasIndex(q => q.DisplayOrder);
        builder.HasIndex(q => q.DeletedAt);
        builder.HasIndex(q => new { q.QuizSetId, q.DisplayOrder }).HasFilter("ngayXoa IS NULL");
    }
}

