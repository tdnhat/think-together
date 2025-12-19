using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ThinkTogether.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Update1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_LuotChoiThachThuc_trangThai",
                table: "LuotChoiThachThuc");

            migrationBuilder.AddCheckConstraint(
                name: "CK_LuotChoiThachThuc_trangThai",
                table: "LuotChoiThachThuc",
                sql: "trangThai IN (1, 2, 3)");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_LuotChoiThachThuc_trangThai",
                table: "LuotChoiThachThuc");

            migrationBuilder.AddCheckConstraint(
                name: "CK_LuotChoiThachThuc_trangThai",
                table: "LuotChoiThachThuc",
                sql: "trangThai IN (1, 2, 3, 4)");
        }
    }
}
