using Domain.Aggregates.UserAggregate.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ThinkTogether.Domain.Aggregates.UserAggregate.Entities;

namespace Infrastructure.Persistence.Configurations;

public class ProfanityFilterConfiguration : IEntityTypeConfiguration<ProfanityFilter>
{
    public void Configure(EntityTypeBuilder<ProfanityFilter> builder)
    {
        builder.ToTable("BoLocTuMieng");
        builder.HasKey(pf => pf.Id);

        builder.Property(pf => pf.Id)
            .HasColumnName("idBoLoc")
            .ValueGeneratedOnAdd();

        builder.Property(pf => pf.Pattern)
            .HasColumnName("pattern")
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(pf => pf.Severity)
            .HasColumnName("mucDoNghiemTrong")
            .IsRequired()
            .HasConversion<string>();

        builder.Property(pf => pf.IsActive)
            .HasColumnName("dangHoatDong")
            .HasDefaultValue(true);

        builder.Property(pf => pf.CreatedAt)
            .HasColumnName("ngayTao")
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(pf => pf.UpdatedAt)
            .HasColumnName("ngayCapNhat");

        // Indexes
        builder.HasIndex(pf => pf.Pattern).IsUnique();
        builder.HasIndex(pf => pf.Severity);
        builder.HasIndex(pf => pf.IsActive);
    }
}
