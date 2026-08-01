using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PCS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPMSCore : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Projects_Companies_CompanyId",
                table: "Projects");

            migrationBuilder.CreateTable(
                name: "ProjectBaselines",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    ProjectId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "TEXT", nullable: false),
                    PlannedStart = table.Column<DateTime>(type: "TEXT", nullable: true),
                    PlannedFinish = table.Column<DateTime>(type: "TEXT", nullable: true),
                    TotalBudget = table.Column<decimal>(type: "TEXT", precision: 18, scale: 2, nullable: false),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false),
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
                    table.PrimaryKey("PK_ProjectBaselines", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProjectBaselines_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectCalendars",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    ProjectId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    WorkingDaysPerWeek = table.Column<int>(type: "INTEGER", nullable: false),
                    WorkingHoursPerDay = table.Column<decimal>(type: "TEXT", precision: 5, scale: 2, nullable: false),
                    SaturdayWorking = table.Column<bool>(type: "INTEGER", nullable: false),
                    SundayWorking = table.Column<bool>(type: "INTEGER", nullable: false),
                    MondayWorking = table.Column<bool>(type: "INTEGER", nullable: false),
                    TuesdayWorking = table.Column<bool>(type: "INTEGER", nullable: false),
                    WednesdayWorking = table.Column<bool>(type: "INTEGER", nullable: false),
                    ThursdayWorking = table.Column<bool>(type: "INTEGER", nullable: false),
                    FridayWorking = table.Column<bool>(type: "INTEGER", nullable: false),
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
                    table.PrimaryKey("PK_ProjectCalendars", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProjectCalendars_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WbsNodes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    ProjectId = table.Column<Guid>(type: "TEXT", nullable: false),
                    ParentId = table.Column<Guid>(type: "TEXT", nullable: true),
                    Code = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 250, nullable: false),
                    Level = table.Column<int>(type: "INTEGER", nullable: false),
                    SortOrder = table.Column<int>(type: "INTEGER", nullable: false),
                    Path = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    Budget = table.Column<decimal>(type: "TEXT", precision: 18, scale: 2, nullable: false),
                    Weight = table.Column<decimal>(type: "TEXT", precision: 5, scale: 2, nullable: false),
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
                    table.PrimaryKey("PK_WbsNodes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WbsNodes_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_WbsNodes_WbsNodes_ParentId",
                        column: x => x.ParentId,
                        principalTable: "WbsNodes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Activities",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    ProjectId = table.Column<Guid>(type: "TEXT", nullable: false),
                    WbsNodeId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Code = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 250, nullable: false),
                    Duration = table.Column<int>(type: "INTEGER", nullable: false),
                    PlannedStart = table.Column<DateTime>(type: "TEXT", nullable: true),
                    PlannedFinish = table.Column<DateTime>(type: "TEXT", nullable: true),
                    ActualStart = table.Column<DateTime>(type: "TEXT", nullable: true),
                    ActualFinish = table.Column<DateTime>(type: "TEXT", nullable: true),
                    RemainingDuration = table.Column<int>(type: "INTEGER", nullable: false),
                    Budget = table.Column<decimal>(type: "TEXT", precision: 18, scale: 2, nullable: false),
                    Weight = table.Column<decimal>(type: "TEXT", precision: 5, scale: 2, nullable: false),
                    Progress = table.Column<decimal>(type: "TEXT", precision: 5, scale: 2, nullable: false),
                    IsMilestone = table.Column<bool>(type: "INTEGER", nullable: false),
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
                    table.PrimaryKey("PK_Activities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Activities_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Activities_WbsNodes_WbsNodeId",
                        column: x => x.WbsNodeId,
                        principalTable: "WbsNodes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ActivityRelationships",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    PredecessorId = table.Column<Guid>(type: "TEXT", nullable: false),
                    SuccessorId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Type = table.Column<string>(type: "TEXT", maxLength: 10, nullable: false),
                    Lag = table.Column<int>(type: "INTEGER", nullable: false),
                    Description = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ActivityRelationships", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ActivityRelationships_Activities_PredecessorId",
                        column: x => x.PredecessorId,
                        principalTable: "Activities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ActivityRelationships_Activities_SuccessorId",
                        column: x => x.SuccessorId,
                        principalTable: "Activities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ProgressEntries",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    ActivityId = table.Column<Guid>(type: "TEXT", nullable: false),
                    ProgressDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Progress = table.Column<decimal>(type: "TEXT", precision: 5, scale: 2, nullable: false),
                    ActualCost = table.Column<decimal>(type: "TEXT", precision: 18, scale: 2, nullable: false),
                    EarnedValue = table.Column<decimal>(type: "TEXT", precision: 18, scale: 2, nullable: false),
                    PlannedValue = table.Column<decimal>(type: "TEXT", precision: 18, scale: 2, nullable: false),
                    RemainingCost = table.Column<decimal>(type: "TEXT", precision: 18, scale: 2, nullable: false),
                    ForecastFinish = table.Column<DateTime>(type: "TEXT", nullable: true),
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
                    table.PrimaryKey("PK_ProgressEntries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProgressEntries_Activities_ActivityId",
                        column: x => x.ActivityId,
                        principalTable: "Activities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Projects_Code",
                table: "Projects",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Companies_Code",
                table: "Companies",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Companies_NationalId",
                table: "Companies",
                column: "NationalId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Activities_ProjectId_Code",
                table: "Activities",
                columns: new[] { "ProjectId", "Code" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Activities_WbsNodeId",
                table: "Activities",
                column: "WbsNodeId");

            migrationBuilder.CreateIndex(
                name: "IX_ActivityRelationships_PredecessorId_SuccessorId",
                table: "ActivityRelationships",
                columns: new[] { "PredecessorId", "SuccessorId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ActivityRelationships_SuccessorId",
                table: "ActivityRelationships",
                column: "SuccessorId");

            migrationBuilder.CreateIndex(
                name: "IX_ProgressEntries_ActivityId_ProgressDate",
                table: "ProgressEntries",
                columns: new[] { "ActivityId", "ProgressDate" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProjectBaselines_ProjectId_Name",
                table: "ProjectBaselines",
                columns: new[] { "ProjectId", "Name" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProjectCalendars_ProjectId_Name",
                table: "ProjectCalendars",
                columns: new[] { "ProjectId", "Name" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_WbsNodes_ParentId",
                table: "WbsNodes",
                column: "ParentId");

            migrationBuilder.CreateIndex(
                name: "IX_WbsNodes_ProjectId_Code",
                table: "WbsNodes",
                columns: new[] { "ProjectId", "Code" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_Companies_CompanyId",
                table: "Projects",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Projects_Companies_CompanyId",
                table: "Projects");

            migrationBuilder.DropTable(
                name: "ActivityRelationships");

            migrationBuilder.DropTable(
                name: "ProgressEntries");

            migrationBuilder.DropTable(
                name: "ProjectBaselines");

            migrationBuilder.DropTable(
                name: "ProjectCalendars");

            migrationBuilder.DropTable(
                name: "Activities");

            migrationBuilder.DropTable(
                name: "WbsNodes");

            migrationBuilder.DropIndex(
                name: "IX_Projects_Code",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_Companies_Code",
                table: "Companies");

            migrationBuilder.DropIndex(
                name: "IX_Companies_NationalId",
                table: "Companies");

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_Companies_CompanyId",
                table: "Projects",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
