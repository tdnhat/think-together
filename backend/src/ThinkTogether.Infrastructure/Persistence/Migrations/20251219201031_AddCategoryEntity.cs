using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ThinkTogether.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddCategoryEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DanhMuc",
                columns: table => new
                {
                    idDanhMuc = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    tenDanhMuc = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    moTa = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    daKichHoat = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    thuTu = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    ngayTao = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ngayXoa = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DanhMuc", x => x.idDanhMuc);
                });

            migrationBuilder.CreateIndex(
                name: "IDX_DanhMuc_IsActive_DisplayOrder",
                table: "DanhMuc",
                columns: new[] { "daKichHoat", "thuTu" });

            migrationBuilder.CreateIndex(
                name: "IDX_DanhMuc_ngayXoa",
                table: "DanhMuc",
                column: "ngayXoa");

            migrationBuilder.CreateIndex(
                name: "IDX_DanhMuc_tenDanhMuc",
                table: "DanhMuc",
                column: "tenDanhMuc",
                unique: true,
                filter: "[ngayXoa] IS NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DanhMuc");
        }
    }
}
