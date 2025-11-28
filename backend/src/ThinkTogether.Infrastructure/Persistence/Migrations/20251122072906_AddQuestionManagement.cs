using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ThinkTogether.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddQuestionManagement : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CauHoi_TracNghiem_CauHoi_QuestionId",
                table: "CauHoi_TracNghiem");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CauHoi_TracNghiem",
                table: "CauHoi_TracNghiem");

            migrationBuilder.DropIndex(
                name: "IX_CauHoi_TracNghiem_QuestionId",
                table: "CauHoi_TracNghiem");

            migrationBuilder.DropCheckConstraint(
                name: "CK_CauHoi_TracNghiem_thuTu",
                table: "CauHoi_TracNghiem");

            migrationBuilder.DropColumn(
                name: "QuestionId",
                table: "CauHoi_TracNghiem");

            migrationBuilder.AddColumn<Guid>(
                name: "idPhuongAn",
                table: "CauHoi_TracNghiem",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "idCauHoi",
                table: "CauHoi_TracNghiem",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<int>(
                name: "dauThoiGianVideo",
                table: "CauHoi",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "urlVideo",
                table: "CauHoi",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_CauHoi_TracNghiem",
                table: "CauHoi_TracNghiem",
                column: "idPhuongAn");

            migrationBuilder.CreateTable(
                name: "CauHoi_CapGhep",
                columns: table => new
                {
                    idMucGhep = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    noiDungTrai = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    noiDungPhai = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    thuTu = table.Column<int>(type: "int", nullable: false),
                    idCauHoi = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CauHoi_CapGhep", x => x.idMucGhep);
                    table.ForeignKey(
                        name: "FK_CauHoi_CapGhep_CauHoi_idCauHoi",
                        column: x => x.idCauHoi,
                        principalTable: "CauHoi",
                        principalColumn: "idCauHoi",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CauHoi_SapXep",
                columns: table => new
                {
                    idMucSapXep = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    noiDung = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    viTriDung = table.Column<int>(type: "int", nullable: false),
                    idCauHoi = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CauHoi_SapXep", x => x.idMucSapXep);
                    table.ForeignKey(
                        name: "FK_CauHoi_SapXep_CauHoi_idCauHoi",
                        column: x => x.idCauHoi,
                        principalTable: "CauHoi",
                        principalColumn: "idCauHoi",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CauHoi_TracNghiem_idCauHoi",
                table: "CauHoi_TracNghiem",
                column: "idCauHoi");

            migrationBuilder.CreateIndex(
                name: "IX_CauHoi_CapGhep_idCauHoi",
                table: "CauHoi_CapGhep",
                column: "idCauHoi");

            migrationBuilder.CreateIndex(
                name: "IX_CauHoi_SapXep_idCauHoi",
                table: "CauHoi_SapXep",
                column: "idCauHoi");

            migrationBuilder.AddForeignKey(
                name: "FK_CauHoi_TracNghiem_CauHoi_idCauHoi",
                table: "CauHoi_TracNghiem",
                column: "idCauHoi",
                principalTable: "CauHoi",
                principalColumn: "idCauHoi",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CauHoi_TracNghiem_CauHoi_idCauHoi",
                table: "CauHoi_TracNghiem");

            migrationBuilder.DropTable(
                name: "CauHoi_CapGhep");

            migrationBuilder.DropTable(
                name: "CauHoi_SapXep");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CauHoi_TracNghiem",
                table: "CauHoi_TracNghiem");

            migrationBuilder.DropIndex(
                name: "IX_CauHoi_TracNghiem_idCauHoi",
                table: "CauHoi_TracNghiem");

            migrationBuilder.DropColumn(
                name: "idPhuongAn",
                table: "CauHoi_TracNghiem");

            migrationBuilder.DropColumn(
                name: "idCauHoi",
                table: "CauHoi_TracNghiem");

            migrationBuilder.DropColumn(
                name: "dauThoiGianVideo",
                table: "CauHoi");

            migrationBuilder.DropColumn(
                name: "urlVideo",
                table: "CauHoi");

            migrationBuilder.AddColumn<Guid>(
                name: "QuestionId",
                table: "CauHoi_TracNghiem",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_CauHoi_TracNghiem",
                table: "CauHoi_TracNghiem",
                columns: new[] { "noiDung", "thuTu" });

            migrationBuilder.CreateIndex(
                name: "IX_CauHoi_TracNghiem_QuestionId",
                table: "CauHoi_TracNghiem",
                column: "QuestionId");

            migrationBuilder.AddCheckConstraint(
                name: "CK_CauHoi_TracNghiem_thuTu",
                table: "CauHoi_TracNghiem",
                sql: "thuTu >= 0");

            migrationBuilder.AddForeignKey(
                name: "FK_CauHoi_TracNghiem_CauHoi_QuestionId",
                table: "CauHoi_TracNghiem",
                column: "QuestionId",
                principalTable: "CauHoi",
                principalColumn: "idCauHoi");
        }
    }
}
