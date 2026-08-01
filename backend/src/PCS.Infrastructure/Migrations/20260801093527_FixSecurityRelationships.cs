using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PCS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixSecurityRelationships : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CompanyAdminRequests_Companies_CompanyId1",
                table: "CompanyAdminRequests");

            migrationBuilder.DropForeignKey(
                name: "FK_CompanyAdminRequests_Users_ExecutedByUserId",
                table: "CompanyAdminRequests");

            migrationBuilder.DropForeignKey(
                name: "FK_CompanyUsers_Companies_CompanyId1",
                table: "CompanyUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_CompanyUsers_Users_UserId1",
                table: "CompanyUsers");

            migrationBuilder.DropIndex(
                name: "IX_CompanyUsers_CompanyId1",
                table: "CompanyUsers");

            migrationBuilder.DropIndex(
                name: "IX_CompanyUsers_UserId1",
                table: "CompanyUsers");

            migrationBuilder.DropIndex(
                name: "IX_CompanyAdminRequests_CompanyId1",
                table: "CompanyAdminRequests");

            migrationBuilder.DropColumn(
                name: "CompanyId1",
                table: "CompanyUsers");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "CompanyUsers");

            migrationBuilder.DropColumn(
                name: "CompanyId1",
                table: "CompanyAdminRequests");

            migrationBuilder.AddForeignKey(
                name: "FK_CompanyAdminRequests_Users_ExecutedByUserId",
                table: "CompanyAdminRequests",
                column: "ExecutedByUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CompanyAdminRequests_Users_ExecutedByUserId",
                table: "CompanyAdminRequests");

            migrationBuilder.AddColumn<Guid>(
                name: "CompanyId1",
                table: "CompanyUsers",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "UserId1",
                table: "CompanyUsers",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "CompanyId1",
                table: "CompanyAdminRequests",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_CompanyUsers_CompanyId1",
                table: "CompanyUsers",
                column: "CompanyId1");

            migrationBuilder.CreateIndex(
                name: "IX_CompanyUsers_UserId1",
                table: "CompanyUsers",
                column: "UserId1");

            migrationBuilder.CreateIndex(
                name: "IX_CompanyAdminRequests_CompanyId1",
                table: "CompanyAdminRequests",
                column: "CompanyId1");

            migrationBuilder.AddForeignKey(
                name: "FK_CompanyAdminRequests_Companies_CompanyId1",
                table: "CompanyAdminRequests",
                column: "CompanyId1",
                principalTable: "Companies",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CompanyAdminRequests_Users_ExecutedByUserId",
                table: "CompanyAdminRequests",
                column: "ExecutedByUserId",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CompanyUsers_Companies_CompanyId1",
                table: "CompanyUsers",
                column: "CompanyId1",
                principalTable: "Companies",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CompanyUsers_Users_UserId1",
                table: "CompanyUsers",
                column: "UserId1",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
