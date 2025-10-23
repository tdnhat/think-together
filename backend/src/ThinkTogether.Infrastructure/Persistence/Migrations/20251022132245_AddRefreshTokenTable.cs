using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ThinkTogether.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddRefreshTokenTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MaLamMoi",
                columns: table => new
                {
                    idMaLamMoi = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idNguoiDung = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    maToken = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    hetHanLuc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    thuHoiLuc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    taoLuc = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    capNhatLuc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MaLamMoi", x => x.idMaLamMoi);
                    table.ForeignKey(
                        name: "FK_MaLamMoi_NguoiDung_idNguoiDung",
                        column: x => x.idNguoiDung,
                        principalTable: "NguoiDung",
                        principalColumn: "idNguoiDung",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MaLamMoi_hetHanLuc",
                table: "MaLamMoi",
                column: "hetHanLuc");

            migrationBuilder.CreateIndex(
                name: "IX_MaLamMoi_idNguoiDung",
                table: "MaLamMoi",
                column: "idNguoiDung");

            migrationBuilder.CreateIndex(
                name: "IX_MaLamMoi_maToken",
                table: "MaLamMoi",
                column: "maToken",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MaLamMoi_thuHoiLuc",
                table: "MaLamMoi",
                column: "thuHoiLuc");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MaLamMoi");
        }
    }
}
