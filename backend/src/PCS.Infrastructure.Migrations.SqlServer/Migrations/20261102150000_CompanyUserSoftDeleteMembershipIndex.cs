using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PCS.Infrastructure.Migrations.SqlServer.Migrations;

public partial class CompanyUserSoftDeleteMembershipIndex : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropIndex(
            name: "IX_CompanyUsers_CompanyId_UserId",
            table: "CompanyUsers");

        migrationBuilder.CreateIndex(
            name: "IX_CompanyUsers_CompanyId_UserId",
            table: "CompanyUsers",
            columns: new[] { "CompanyId", "UserId" },
            unique: true,
            filter: "[IsDeleted] = 0");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropIndex(
            name: "IX_CompanyUsers_CompanyId_UserId",
            table: "CompanyUsers");

        migrationBuilder.CreateIndex(
            name: "IX_CompanyUsers_CompanyId_UserId",
            table: "CompanyUsers",
            columns: new[] { "CompanyId", "UserId" },
            unique: true);
    }
}
