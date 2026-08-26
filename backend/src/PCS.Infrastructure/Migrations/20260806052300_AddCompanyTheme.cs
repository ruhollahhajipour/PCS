using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PCS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCompanyTheme : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ThemeBorderColor",
                table: "Companies",
                type: "TEXT",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ThemeDarkColor",
                table: "Companies",
                type: "TEXT",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "ThemeIsCustomTheme",
                table: "Companies",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "ThemeLogoPath",
                table: "Companies",
                type: "TEXT",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ThemePrimaryColor",
                table: "Companies",
                type: "TEXT",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ThemeSecondaryColor",
                table: "Companies",
                type: "TEXT",
                maxLength: 20,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ThemeBorderColor",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "ThemeDarkColor",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "ThemeIsCustomTheme",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "ThemeLogoPath",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "ThemePrimaryColor",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "ThemeSecondaryColor",
                table: "Companies");
        }
    }
}
