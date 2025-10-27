using Domain.Aggregates.UserAggregate;
using Domain.Aggregates.UserAggregate.ValueObjects;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        // Table name
        builder.ToTable("NguoiDung");

        // Primary key
        builder.HasKey(u => u.Id);

        builder.Property(u => u.Id)
            .HasColumnName("idNguoiDung")
            .ValueGeneratedNever(); // Application generates the ID (GUID)

        builder.Property(u => u.Email)
            .HasConversion(
                email => email.Value,
                value => Email.Create(value))
            .HasColumnName("email")
            .IsRequired()
            .HasMaxLength(255);

        builder.HasIndex(u => u.Email).IsUnique();

        builder.Property(u => u.PasswordHash)
            .HasConversion(
                password => password.HashedValue,
                value => Password.CreateFromHash(value))
            .HasColumnName("matKhau")
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(u => u.FirstName)
            .HasColumnName("tenDem")
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(u => u.LastName)
            .HasColumnName("tenGoi")
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(u => u.Role)
            .HasColumnName("vaiTro")
            .IsRequired()
            .HasConversion<string>();

        builder.Property(u => u.AvatarUrl)
            .HasColumnName("urlAnhDaiDien")
            .HasMaxLength(500);

        builder.Property(u => u.Bio)
            .HasColumnName("gioiThieu")
            .HasMaxLength(-1); // nvarchar(max)

        builder.Property(u => u.IsEmailVerified)
            .HasColumnName("daXacNhanEmail")
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(u => u.CreatedAt)
            .HasColumnName("ngayTao")
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(u => u.UpdatedAt)
            .HasColumnName("ngayCapNhat");

        builder.Property(u => u.DeletedAt)
            .HasColumnName("ngayXoa");

        // Indexes
        builder.HasIndex(u => u.Role);
        builder.HasIndex(u => u.DeletedAt);

        // Configure UserTokens relationship
        builder.HasMany(u => u.UserTokens)
            .WithOne()
            .HasForeignKey(ut => ut.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
