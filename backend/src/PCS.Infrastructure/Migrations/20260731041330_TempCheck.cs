using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PCS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class TempCheck : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "EndDate",
                table: "Projects",
                newName: "Status");

            migrationBuilder.AddColumn<decimal>(
                name: "ActualCost",
                table: "WbsNodes",
                type: "TEXT",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "WbsNodes",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "WbsNodes",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "Progress",
                table: "WbsNodes",
                type: "TEXT",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "ActualCost",
                table: "Projects",
                type: "TEXT",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "CPI",
                table: "Projects",
                type: "TEXT",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<DateOnly>(
                name: "FinishDate",
                table: "Projects",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "PlantId",
                table: "Projects",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Progress",
                table: "Projects",
                type: "TEXT",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "SPI",
                table: "Projects",
                type: "TEXT",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "ProjectCalendars",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "ProjectCalendars",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDefault",
                table: "ProjectCalendars",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<TimeOnly>(
                name: "WorkFinish",
                table: "ProjectCalendars",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<TimeOnly>(
                name: "WorkStart",
                table: "ProjectCalendars",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsApproved",
                table: "ProjectBaselines",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "PlannedDuration",
                table: "ProjectBaselines",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "PlannedValue",
                table: "ProjectBaselines",
                type: "TEXT",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "Version",
                table: "ProjectBaselines",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "ActivityRelationships",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "ActualCost",
                table: "Activities",
                type: "TEXT",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<Guid>(
                name: "CalendarId",
                table: "Activities",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ConstraintDate",
                table: "Activities",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ConstraintType",
                table: "Activities",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Activities",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DrivingFloat",
                table: "Activities",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "EarnedValue",
                table: "Activities",
                type: "TEXT",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "PercentComplete",
                table: "Activities",
                type: "TEXT",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Activities",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "AuditLogs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Username = table.Column<string>(type: "TEXT", nullable: false),
                    Module = table.Column<string>(type: "TEXT", nullable: false),
                    Entity = table.Column<string>(type: "TEXT", nullable: false),
                    Action = table.Column<string>(type: "TEXT", nullable: false),
                    EntityId = table.Column<string>(type: "TEXT", nullable: false),
                    OldValues = table.Column<string>(type: "TEXT", nullable: true),
                    NewValues = table.Column<string>(type: "TEXT", nullable: true),
                    IpAddress = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuditLogs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Notifications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Title = table.Column<string>(type: "TEXT", nullable: false),
                    Message = table.Column<string>(type: "TEXT", nullable: false),
                    Type = table.Column<string>(type: "TEXT", nullable: false),
                    IsRead = table.Column<bool>(type: "INTEGER", nullable: false),
                    Url = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CreatedBy = table.Column<string>(type: "TEXT", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    UpdatedBy = table.Column<string>(type: "TEXT", nullable: true),
                    IsDeleted = table.Column<bool>(type: "INTEGER", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    DeletedBy = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notifications", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Activities_CalendarId",
                table: "Activities",
                column: "CalendarId");

            migrationBuilder.AddForeignKey(
                name: "FK_Activities_ProjectCalendars_CalendarId",
                table: "Activities",
                column: "CalendarId",
                principalTable: "ProjectCalendars",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Activities_ProjectCalendars_CalendarId",
                table: "Activities");

            migrationBuilder.DropTable(
                name: "AuditLogs");

            migrationBuilder.DropTable(
                name: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_Activities_CalendarId",
                table: "Activities");

            migrationBuilder.DropColumn(
                name: "ActualCost",
                table: "WbsNodes");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "WbsNodes");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "WbsNodes");

            migrationBuilder.DropColumn(
                name: "Progress",
                table: "WbsNodes");

            migrationBuilder.DropColumn(
                name: "ActualCost",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "CPI",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "FinishDate",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "PlantId",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "Progress",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "SPI",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "ProjectCalendars");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "ProjectCalendars");

            migrationBuilder.DropColumn(
                name: "IsDefault",
                table: "ProjectCalendars");

            migrationBuilder.DropColumn(
                name: "WorkFinish",
                table: "ProjectCalendars");

            migrationBuilder.DropColumn(
                name: "WorkStart",
                table: "ProjectCalendars");

            migrationBuilder.DropColumn(
                name: "IsApproved",
                table: "ProjectBaselines");

            migrationBuilder.DropColumn(
                name: "PlannedDuration",
                table: "ProjectBaselines");

            migrationBuilder.DropColumn(
                name: "PlannedValue",
                table: "ProjectBaselines");

            migrationBuilder.DropColumn(
                name: "Version",
                table: "ProjectBaselines");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "ActivityRelationships");

            migrationBuilder.DropColumn(
                name: "ActualCost",
                table: "Activities");

            migrationBuilder.DropColumn(
                name: "CalendarId",
                table: "Activities");

            migrationBuilder.DropColumn(
                name: "ConstraintDate",
                table: "Activities");

            migrationBuilder.DropColumn(
                name: "ConstraintType",
                table: "Activities");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Activities");

            migrationBuilder.DropColumn(
                name: "DrivingFloat",
                table: "Activities");

            migrationBuilder.DropColumn(
                name: "EarnedValue",
                table: "Activities");

            migrationBuilder.DropColumn(
                name: "PercentComplete",
                table: "Activities");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Activities");

            migrationBuilder.RenameColumn(
                name: "Status",
                table: "Projects",
                newName: "EndDate");
        }
    }
}
