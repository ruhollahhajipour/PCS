using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PCS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FinalizePlanningModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ActivityRelationships_PredecessorId_SuccessorId",
                table: "ActivityRelationships");

            migrationBuilder.DropColumn(
                name: "CreatedOn",
                table: "ProjectBaselines");

            migrationBuilder.AddColumn<string>(
                name: "ExternalCode",
                table: "WbsNodes",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsCostControlEnabled",
                table: "WbsNodes",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "WbsNodes",
                type: "TEXT",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "CostControlActivatedDate",
                table: "Projects",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsCostControlEnabled",
                table: "Projects",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "ProjectBaselines",
                type: "TEXT",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldMaxLength: 500);

            migrationBuilder.CreateIndex(
                name: "IX_ProjectCalendars_ProjectId_IsDefault",
                table: "ProjectCalendars",
                columns: new[] { "ProjectId", "IsDefault" });

            migrationBuilder.CreateIndex(
                name: "IX_ProjectBaselines_ProjectId_Version",
                table: "ProjectBaselines",
                columns: new[] { "ProjectId", "Version" });

            migrationBuilder.CreateIndex(
                name: "IX_ActivityRelationships_PredecessorId_SuccessorId_Type",
                table: "ActivityRelationships",
                columns: new[] { "PredecessorId", "SuccessorId", "Type" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ProjectCalendars_ProjectId_IsDefault",
                table: "ProjectCalendars");

            migrationBuilder.DropIndex(
                name: "IX_ProjectBaselines_ProjectId_Version",
                table: "ProjectBaselines");

            migrationBuilder.DropIndex(
                name: "IX_ActivityRelationships_PredecessorId_SuccessorId_Type",
                table: "ActivityRelationships");

            migrationBuilder.DropColumn(
                name: "ExternalCode",
                table: "WbsNodes");

            migrationBuilder.DropColumn(
                name: "IsCostControlEnabled",
                table: "WbsNodes");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "WbsNodes");

            migrationBuilder.DropColumn(
                name: "CostControlActivatedDate",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "IsCostControlEnabled",
                table: "Projects");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "ProjectBaselines",
                type: "TEXT",
                maxLength: 500,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldMaxLength: 500,
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedOn",
                table: "ProjectBaselines",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateIndex(
                name: "IX_ActivityRelationships_PredecessorId_SuccessorId",
                table: "ActivityRelationships",
                columns: new[] { "PredecessorId", "SuccessorId" },
                unique: true);
        }
    }
}
