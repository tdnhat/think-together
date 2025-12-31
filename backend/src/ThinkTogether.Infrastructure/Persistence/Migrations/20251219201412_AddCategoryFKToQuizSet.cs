using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ThinkTogether.Infrastructure.Persistence.Migrations
{
    public partial class AddCategoryFKToQuizSet : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "idDanhMuc",
                table: "BoTracNghiem",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_BoTracNghiem_idDanhMuc",
                table: "BoTracNghiem",
                column: "idDanhMuc");

            migrationBuilder.AddForeignKey(
                name: "FK_BoTracNghiem_DanhMuc_idDanhMuc",
                table: "BoTracNghiem",
                column: "idDanhMuc",
                principalTable: "DanhMuc",
                principalColumn: "idDanhMuc",
                onDelete: ReferentialAction.SetNull);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BoTracNghiem_DanhMuc_idDanhMuc",
                table: "BoTracNghiem");

            migrationBuilder.DropIndex(
                name: "IX_BoTracNghiem_idDanhMuc",
                table: "BoTracNghiem");

            migrationBuilder.DropColumn(
                name: "idDanhMuc",
                table: "BoTracNghiem");
        }
    }
}
