using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PCS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddWbsCalculationFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "EarnedValue",
                table: "WbsNodes",
                type: "TEXT",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "PlannedValue",
                table: "WbsNodes",
                type: "TEXT",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "WeightFactor",
                table: "WbsNodes",
                type: "TEXT",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "WeightValue",
                table: "WbsNodes",
                type: "TEXT",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<Guid>(
                name: "Theme_Id",
                table: "Companies",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EarnedValue",
                table: "WbsNodes");

            migrationBuilder.DropColumn(
                name: "PlannedValue",
                table: "WbsNodes");

            migrationBuilder.DropColumn(
                name: "WeightFactor",
                table: "WbsNodes");

            migrationBuilder.DropColumn(
                name: "WeightValue",
                table: "WbsNodes");

            migrationBuilder.DropColumn(
                name: "Theme_Id",
                table: "Companies");
        }
    }
}
