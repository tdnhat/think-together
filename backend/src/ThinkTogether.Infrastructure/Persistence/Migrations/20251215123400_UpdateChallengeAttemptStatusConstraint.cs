using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ThinkTogether.Infrastructure.Persistence.Migrations
{
    public partial class UpdateChallengeAttemptStatusConstraint : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_LuotChoiThachThuc_trangThai",
                table: "LuotChoiThachThuc");

            migrationBuilder.AddCheckConstraint(
                name: "CK_LuotChoiThachThuc_trangThai",
                table: "LuotChoiThachThuc",
                sql: "trangThai IN (1, 2, 3, 4)");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_LuotChoiThachThuc_trangThai",
                table: "LuotChoiThachThuc");

            migrationBuilder.AddCheckConstraint(
                name: "CK_LuotChoiThachThuc_trangThai",
                table: "LuotChoiThachThuc",
                sql: "trangThai IN (1, 2, 3)");
        }
    }
}
