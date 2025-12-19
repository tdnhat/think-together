﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ThinkTogether.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddUniqueChallengeLinkContraint : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Step 1: Soft delete duplicate challenges (keep the most recent one per creator per quiz)
            migrationBuilder.Sql(@"
                WITH DuplicateChallenges AS (
                    SELECT 
                        idThachThuc,
                        ROW_NUMBER() OVER (
                            PARTITION BY idNguoiTao, idBoTracNghiem 
                            ORDER BY ngayTao DESC, idThachThuc DESC
                        ) AS RowNum
                    FROM ThachThuc
                    WHERE ngayXoa IS NULL
                )
                UPDATE ThachThuc
                SET ngayXoa = GETUTCDATE()
                FROM ThachThuc t
                INNER JOIN DuplicateChallenges d ON t.idThachThuc = d.idThachThuc
                WHERE d.RowNum > 1
            ");

            // Step 2: Create unique constraint on CreatorId and QuizSetId
            // Only for non-deleted records (soft delete filter)
            migrationBuilder.CreateIndex(
                name: "IX_ThachThuc_idNguoiTao_idBoTracNghiem",
                table: "ThachThuc",
                columns: new[] { "idNguoiTao", "idBoTracNghiem" },
                unique: true,
                filter: "ngayXoa IS NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ThachThuc_idNguoiTao_idBoTracNghiem",
                table: "ThachThuc");
        }
    }
}
