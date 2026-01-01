using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ThinkTogether.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class DropDisplayOrderInCategory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IDX_DanhMuc_IsActive_DisplayOrder",
                table: "DanhMuc");

            migrationBuilder.DropColumn(
                name: "thuTu",
                table: "DanhMuc");

            migrationBuilder.CreateIndex(
                name: "IDX_DanhMuc_IsActive",
                table: "DanhMuc",
                column: "daKichHoat");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IDX_DanhMuc_IsActive",
                table: "DanhMuc");

            migrationBuilder.AddColumn<int>(
                name: "thuTu",
                table: "DanhMuc",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IDX_DanhMuc_IsActive_DisplayOrder",
                table: "DanhMuc",
                columns: new[] { "daKichHoat", "thuTu" });
        }
    }
}
