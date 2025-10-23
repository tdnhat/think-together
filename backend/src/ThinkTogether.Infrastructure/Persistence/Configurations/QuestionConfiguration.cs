using Domain.Aggregates.QuizSetAggregate.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class QuestionConfiguration : IEntityTypeConfiguration<Question>
{
    public void Configure(EntityTypeBuilder<Question> builder)
    {
        // Table name
        builder.ToTable("CauHoi");

        // Primary key
        builder.HasKey(q => q.Id);

        // Properties mapping to Vietnamese column names
        builder.Property(q => q.Id)
        .HasColumnName("idCauHoi")
        .ValueGeneratedOnAdd();

        builder.Property(q => q.Content)
            .HasColumnName("noiDung")
            .IsRequired()
            .HasMaxLength(-1); // nvarchar(max)

        builder.Property(q => q.Type)
            .HasColumnName("loaiCauHoi")
            .IsRequired()
            .HasConversion<string>();

        builder.Property(q => q.TimeLimit)
            .HasColumnName("giuiHanThoiGian")
            .HasDefaultValue(30);

        builder.Property(q => q.Order)
            .HasColumnName("thuTu")
            .HasDefaultValue(0);

        builder.Property(q => q.CreatedAt)
            .HasColumnName("ngayTao")
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(q => q.UpdatedAt)
            .HasColumnName("ngayCapNhat");

        builder.Property(q => q.DeletedAt)
        .HasColumnName("ngayXoa");

        // Owned types
        builder.OwnsMany(q => q.Answers, answers =>
        {
            answers.ToTable("CauTraLoi");
            answers.WithOwner().HasForeignKey("idCauHoi");
            answers.Property(a => a.Content).HasColumnName("noiDung").IsRequired().HasMaxLength(-1);
            answers.Property(a => a.IsCorrect).HasColumnName("laDapAnDung").IsRequired();
            answers.Property(a => a.Order).HasColumnName("thuTu").IsRequired();
            answers.Property(a => a.ImageUrl).HasColumnName("urlAnh").HasMaxLength(500);
        });

        builder.OwnsMany(q => q.MatchPairs, matchPairs =>
        {
            matchPairs.ToTable("CapGhep");
            matchPairs.WithOwner().HasForeignKey("idCauHoi");
            matchPairs.Property(mp => mp.LeftContent).HasColumnName("noiDungTrai").IsRequired().HasMaxLength(-1);
            matchPairs.Property(mp => mp.RightContent).HasColumnName("noiDungPhai").IsRequired().HasMaxLength(-1);
            matchPairs.Property(mp => mp.Order).HasColumnName("thuTu").IsRequired();
        });

        builder.OwnsMany(q => q.OrderItems, orderItems =>
        {
            orderItems.ToTable("MucSapXep");
            orderItems.WithOwner().HasForeignKey("idCauHoi");
            orderItems.Property(oi => oi.Content).HasColumnName("noiDung").IsRequired().HasMaxLength(-1);
            orderItems.Property(oi => oi.CorrectPosition).HasColumnName("viTriDung").IsRequired();
        });

        // Indexes
        builder.HasIndex(q => q.Order);
        builder.HasIndex(q => q.DeletedAt);
    }
}
