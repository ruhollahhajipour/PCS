using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using PCS.Infrastructure.Persistence;

#nullable disable

namespace PCS.Infrastructure.Migrations;

[DbContext(typeof(PCSDbContext))]
[Migration("20261030120000_AddTimePhasedProjectBaselines")]
public partial class AddTimePhasedProjectBaselines : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<DateTime>(
            name: "ApprovedAt",
            table: "ProjectBaselines",
            nullable: true);

        migrationBuilder.AddColumn<string>(
            name: "ApprovedBy",
            table: "ProjectBaselines",
            maxLength: 200,
            nullable: true);

        migrationBuilder.CreateTable(
            name: "ProjectBaselineActivities",
            columns: table => new
            {
                Id = table.Column<Guid>(nullable: false),
                ProjectBaselineId = table.Column<Guid>(nullable: false),
                ActivityId = table.Column<Guid>(nullable: false),
                ActivityCode = table.Column<string>(maxLength: 50, nullable: false),
                ActivityName = table.Column<string>(maxLength: 250, nullable: false),
                WbsCode = table.Column<string>(maxLength: 50, nullable: false),
                WbsName = table.Column<string>(maxLength: 250, nullable: false),
                PlannedStart = table.Column<DateTime>(nullable: true),
                PlannedFinish = table.Column<DateTime>(nullable: true),
                PlannedDuration = table.Column<int>(nullable: false),
                Budget = table.Column<decimal>(precision: 18, scale: 2, nullable: false),
                WorkingDaysMask = table.Column<int>(nullable: false),
                WorkingHoursPerDay = table.Column<decimal>(precision: 5, scale: 2, nullable: false),
                IsMilestone = table.Column<bool>(nullable: false),
                CalendarName = table.Column<string>(maxLength: 200, nullable: false),
                CreatedAt = table.Column<DateTime>(nullable: false),
                CreatedBy = table.Column<string>(nullable: true),
                UpdatedAt = table.Column<DateTime>(nullable: true),
                UpdatedBy = table.Column<string>(nullable: true),
                IsDeleted = table.Column<bool>(nullable: false),
                DeletedAt = table.Column<DateTime>(nullable: true),
                DeletedBy = table.Column<string>(nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_ProjectBaselineActivities", x => x.Id);
                table.ForeignKey(
                    name: "FK_ProjectBaselineActivities_ProjectBaselines_ProjectBaselineId",
                    column: x => x.ProjectBaselineId,
                    principalTable: "ProjectBaselines",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateIndex(
            name: "IX_ProjectBaselineActivities_ProjectBaselineId_ActivityId",
            table: "ProjectBaselineActivities",
            columns: new[] { "ProjectBaselineId", "ActivityId" },
            unique: true);

        migrationBuilder.CreateIndex(
            name: "IX_ProjectBaselineActivities_ProjectBaselineId_WbsCode",
            table: "ProjectBaselineActivities",
            columns: new[] { "ProjectBaselineId", "WbsCode" });

        migrationBuilder.CreateIndex(
            name: "IX_ProjectBaselines_ProjectId",
            table: "ProjectBaselines",
            column: "ProjectId",
            unique: true,
            filter: "IsApproved = 1 AND IsActive = 1");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropIndex(
            name: "IX_ProjectBaselines_ProjectId",
            table: "ProjectBaselines");

        migrationBuilder.DropTable(
            name: "ProjectBaselineActivities");

        migrationBuilder.DropColumn(
            name: "ApprovedAt",
            table: "ProjectBaselines");

        migrationBuilder.DropColumn(
            name: "ApprovedBy",
            table: "ProjectBaselines");
    }
}
