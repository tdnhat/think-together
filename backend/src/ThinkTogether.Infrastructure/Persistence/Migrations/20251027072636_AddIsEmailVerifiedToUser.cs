using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ThinkTogether.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddIsEmailVerifiedToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "daXacNhanEmail",
                table: "NguoiDung",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "daXacNhanEmail",
                table: "NguoiDung");
        }
    }
}
