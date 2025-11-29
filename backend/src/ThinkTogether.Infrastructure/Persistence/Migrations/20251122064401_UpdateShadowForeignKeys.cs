using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ThinkTogether.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class UpdateShadowForeignKeys : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_NguoiDung_VaiTro_RoleId1",
                table: "NguoiDung");

            migrationBuilder.DropIndex(
                name: "IX_NguoiDung_RoleId1",
                table: "NguoiDung");

            migrationBuilder.DropColumn(
                name: "RoleId1",
                table: "NguoiDung");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "RoleId1",
                table: "NguoiDung",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_NguoiDung_RoleId1",
                table: "NguoiDung",
                column: "RoleId1");

            migrationBuilder.AddForeignKey(
                name: "FK_NguoiDung_VaiTro_RoleId1",
                table: "NguoiDung",
                column: "RoleId1",
                principalTable: "VaiTro",
                principalColumn: "idVaiTro");
        }
    }
}
