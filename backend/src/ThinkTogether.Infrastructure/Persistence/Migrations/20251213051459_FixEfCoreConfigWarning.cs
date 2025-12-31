using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ThinkTogether.Infrastructure.Persistence.Migrations
{
    public partial class FixEfCoreConfigWarning : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CauHoiDanhDau_LuotChoiThachThuc_ChallengeAttemptId1",
                table: "CauHoiDanhDau");

            migrationBuilder.DropIndex(
                name: "IX_CauHoiDanhDau_ChallengeAttemptId1",
                table: "CauHoiDanhDau");

            migrationBuilder.DropColumn(
                name: "ChallengeAttemptId1",
                table: "CauHoiDanhDau");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ChallengeAttemptId1",
                table: "CauHoiDanhDau",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_CauHoiDanhDau_ChallengeAttemptId1",
                table: "CauHoiDanhDau",
                column: "ChallengeAttemptId1");

            migrationBuilder.AddForeignKey(
                name: "FK_CauHoiDanhDau_LuotChoiThachThuc_ChallengeAttemptId1",
                table: "CauHoiDanhDau",
                column: "ChallengeAttemptId1",
                principalTable: "LuotChoiThachThuc",
                principalColumn: "idLuotChoi");
        }
    }
}
