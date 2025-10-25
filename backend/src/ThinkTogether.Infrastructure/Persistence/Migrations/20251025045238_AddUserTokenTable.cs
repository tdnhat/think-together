using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ThinkTogether.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddUserTokenTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MaNguoiDung",
                columns: table => new
                {
                    idMaNguoiDung = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    loaiToken = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    idNguoiDung = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    maToken = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    hetHanLuc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    suDungLuc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    taoLuc = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    capNhatLuc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MaNguoiDung", x => x.idMaNguoiDung);
                    table.ForeignKey(
                        name: "FK_MaNguoiDung_NguoiDung_idNguoiDung",
                        column: x => x.idNguoiDung,
                        principalTable: "NguoiDung",
                        principalColumn: "idNguoiDung",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MaNguoiDung_hetHanLuc",
                table: "MaNguoiDung",
                column: "hetHanLuc");

            migrationBuilder.CreateIndex(
                name: "IX_MaNguoiDung_idNguoiDung",
                table: "MaNguoiDung",
                column: "idNguoiDung");

            migrationBuilder.CreateIndex(
                name: "IX_MaNguoiDung_idNguoiDung_loaiToken_suDungLuc",
                table: "MaNguoiDung",
                columns: new[] { "idNguoiDung", "loaiToken", "suDungLuc" });

            migrationBuilder.CreateIndex(
                name: "IX_MaNguoiDung_loaiToken",
                table: "MaNguoiDung",
                column: "loaiToken");

            migrationBuilder.CreateIndex(
                name: "IX_MaNguoiDung_maToken",
                table: "MaNguoiDung",
                column: "maToken",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MaNguoiDung_suDungLuc",
                table: "MaNguoiDung",
                column: "suDungLuc");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MaNguoiDung");
        }
    }
}
