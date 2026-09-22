using PCS.Application.Planning.DTOs;
using PCS.Application.Planning.Interfaces;

namespace PCS.Application.Planning.Services;

public class PmsGanttService : IPmsGanttService
{
    private readonly IActivityRepository _repository;

    public PmsGanttService(
        IActivityRepository repository)
    {
        _repository = repository;
    }

    public async Task<GanttProjectDto> GetGanttAsync(
        Guid projectId)
    {
        var activities =
            await _repository
                .GetProjectActivitiesAsync(projectId);

        var orderedActivities =
            activities
                .OrderBy(x => x.EarlyStart)
                .ThenBy(x => x.EarlyFinish)
                .ThenBy(x => x.Code)
                .ToList();

        // ---------------------------------------------------------
        // Activity lookup
        // Used to resolve relationship IDs to activity codes.
        // ---------------------------------------------------------
        var activityLookup =
            orderedActivities
                .ToDictionary(
                    x => x.Id,
                    x => x);

        // ---------------------------------------------------------
        // Project duration
        //
        // Keep the existing CPM-relative duration calculation
        // for compatibility with the current Gantt implementation.
        // Real calendar dates are exposed separately through
        // PlannedStart / PlannedFinish / ActualStart / ActualFinish.
        // ---------------------------------------------------------
        var duration =
            orderedActivities.Any()
                ? orderedActivities.Max(
                    x => Math.Max(
                        x.EarlyFinish,
                        x.EarlyStart +
                        Math.Max(
                            0,
                            x.Duration)))
                : 0;

        // ---------------------------------------------------------
        // DTO mapping
        // ---------------------------------------------------------
        var ganttActivities =
            orderedActivities
                .Select(x =>
                {
                    var finish =
                        Math.Max(
                            x.EarlyFinish,
                            x.EarlyStart +
                            Math.Max(
                                0,
                                x.Duration));

                    // -------------------------------------------------
                    // Predecessors
                    // -------------------------------------------------
                    var predecessors =
                        x.Predecessors
                            .Where(r =>
                                r.IsActive &&
                                activityLookup.ContainsKey(
                                    r.PredecessorId))
                            .OrderBy(r => r.Type)
                            .ThenBy(r => r.Lag)
                            .Select(r =>
                            {
                                var predecessor =
                                    activityLookup[
                                        r.PredecessorId];

                                return new GanttRelationshipDto
                                {
                                    ActivityId =
                                        predecessor.Id,

                                    Code =
                                        predecessor.Code,

                                    Type =
                                        string.IsNullOrWhiteSpace(
                                            r.Type)
                                            ? "FS"
                                            : r.Type,

                                    Lag =
                                        r.Lag
                                };
                            })
                            .ToList();

                    // -------------------------------------------------
                    // Successors
                    // -------------------------------------------------
                    var successors =
                        x.Successors
                            .Where(r =>
                                r.IsActive &&
                                activityLookup.ContainsKey(
                                    r.SuccessorId))
                            .OrderBy(r => r.Type)
                            .ThenBy(r => r.Lag)
                            .Select(r =>
                            {
                                var successor =
                                    activityLookup[
                                        r.SuccessorId];

                                return new GanttRelationshipDto
                                {
                                    ActivityId =
                                        successor.Id,

                                    Code =
                                        successor.Code,

                                    Type =
                                        string.IsNullOrWhiteSpace(
                                            r.Type)
                                            ? "FS"
                                            : r.Type,

                                    Lag =
                                        r.Lag
                                };
                            })
                            .ToList();

                    return new GanttActivityDto
                    {
                        // =============================================
                        // Identity
                        // =============================================
                        Id =
                            x.Id,

                        Code =
                            x.Code,

                        Name =
                            x.Name,

                        Description =
                            x.Description,

                        // =============================================
                        // Current Gantt compatibility
                        // =============================================
                        Start =
                            Math.Max(
                                0,
                                x.EarlyStart),

                        Finish =
                            finish,

                        Duration =
                            Math.Max(
                                0,
                                x.Duration),

                        // =============================================
                        // Planned Schedule
                        // =============================================
                        PlannedStart =
                            x.PlannedStart,

                        PlannedFinish =
                            x.PlannedFinish,

                        // =============================================
                        // Actual Schedule
                        // =============================================
                        ActualStart =
                            x.ActualStart,

                        ActualFinish =
                            x.ActualFinish,

                        RemainingDuration =
                            Math.Max(
                                0,
                                x.RemainingDuration),

                        // =============================================
                        // Constraint
                        // =============================================
                        ConstraintType =
                            string.IsNullOrWhiteSpace(
                                x.ConstraintType)
                                ? "ASAP"
                                : x.ConstraintType,

                        ConstraintDate =
                            x.ConstraintDate,

                        // =============================================
                        // Progress / Weight
                        // =============================================
                        Progress =
                            x.Progress,

                        Weight =
                            x.Weight,

                        // =============================================
                        // Cost / EVM
                        // =============================================
                        Budget =
                            x.Budget,

                        ActualCost =
                            x.ActualCost,

                        EarnedValue =
                            x.EarnedValue,

                        // =============================================
                        // CPM
                        // =============================================
                        EarlyStart =
                            x.EarlyStart,

                        EarlyFinish =
                            x.EarlyFinish,

                        LateStart =
                            x.LateStart,

                        LateFinish =
                            x.LateFinish,

                        TotalFloat =
                            x.TotalFloat,

                        FreeFloat =
                            x.FreeFloat,

                        DrivingFloat =
                            x.DrivingFloat,

                        // Compatibility with current Gantt
                        Float =
                            Math.Max(
                                0,
                                x.TotalFloat),

                        IsCritical =
                            x.IsCritical,

                        // =============================================
                        // Status
                        // =============================================
                        Status =
                            string.IsNullOrWhiteSpace(
                                x.Status)
                                ? "NotStarted"
                                : x.Status,

                        IsMilestone =
                            x.IsMilestone,

                        // =============================================
                        // WBS Context
                        // =============================================
                        WbsNodeId =
                            x.WbsNodeId,

                        WbsCode =
                            x.WbsNode?.Code,

                        WbsName =
                            x.WbsNode?.Name,

                        WbsLevel =
                            x.WbsNode?.Level ?? 0,

                        // =============================================
                        // Relationships
                        // =============================================
                        Predecessors =
                            predecessors,

                        Successors =
                            successors
                    };
                })
                .ToList();

        return new GanttProjectDto
        {
            ProjectId =
                projectId,

            Duration =
                Math.Max(
                    duration,
                    1),

            Activities =
                ganttActivities
        };
    }
}