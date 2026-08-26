using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PCS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SyncRoleConfiguration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // ============================================================
            // Synchronize existing Roles with SecuritySeed codes.
            //
            // Existing databases may contain Roles created before Code
            // was introduced. Those records may currently contain an
            // empty Code value.
            //
            // We update by stable Role Name so existing Role Id values
            // and all existing relationships remain intact.
            // ============================================================

            migrationBuilder.Sql("""
                UPDATE "Roles"
                SET "Code" = CASE "Name"
                    WHEN 'SuperAdmin' THEN 'SUPER_ADMIN'
                    WHEN 'CompanyAdmin' THEN 'COMPANY_ADMIN'
                    WHEN 'ProjectManager' THEN 'PROJECT_MANAGER'
                    WHEN 'CostController' THEN 'COST_CONTROLLER'
                    WHEN 'DocumentManager' THEN 'DOCUMENT_MANAGER'
                    WHEN 'Viewer' THEN 'VIEWER'
                    ELSE "Code"
                END
                WHERE "Name" IN (
                    'SuperAdmin',
                    'CompanyAdmin',
                    'ProjectManager',
                    'CostController',
                    'DocumentManager',
                    'Viewer'
                )
                AND ("Code" IS NULL OR TRIM("Code") = '');
                """);

            // ============================================================
            // Code must be unique.
            // ============================================================

            migrationBuilder.CreateIndex(
                name: "IX_Roles_Code",
                table: "Roles",
                column: "Code",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Roles_Code",
                table: "Roles");
        }
    }
}
