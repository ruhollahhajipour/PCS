using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PCS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class TenantScopeAndEvmPrecision : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_CompanyUsers_CompanyId_IsPrimaryAdmin",
                table: "CompanyUsers");

            migrationBuilder.CreateIndex(
                name: "IX_CompanyUsers_CompanyId_IsPrimaryAdmin",
                table: "CompanyUsers",
                columns: new[] { "CompanyId", "IsPrimaryAdmin" },
                unique: true,
                filter: "\"IsPrimaryAdmin\" = 1 AND \"IsActive\" = 1");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_CompanyUsers_CompanyId_IsPrimaryAdmin",
                table: "CompanyUsers");

            migrationBuilder.CreateIndex(
                name: "IX_CompanyUsers_CompanyId_IsPrimaryAdmin",
                table: "CompanyUsers",
                columns: new[] { "CompanyId", "IsPrimaryAdmin" },
                unique: true,
                filter: "\"IsPrimaryAdmin\" = 1");
        }
    }
}
