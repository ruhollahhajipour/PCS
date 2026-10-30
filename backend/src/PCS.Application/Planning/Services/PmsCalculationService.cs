using PCS.Application.Planning.DTOs;
using PCS.Application.Planning.Interfaces;
using PCS.Domain.Entities.Planning;

namespace PCS.Application.Planning.Services;

public sealed class PmsCalculationService
    : IPmsCalculationService
{
    public void CalculateActivities(
        IEnumerable<Activity> activities)
    {
        foreach (var activity in activities)
        {
            activity.EarnedValue =
                activity.Budget *
                (activity.Progress / 100m);
        }
    }




    public void CalculateWbsRollup(
        IEnumerable<WbsNode> wbsNodes)
    {
        var nodes =
            wbsNodes
            .OrderByDescending(x => x.Level)
            .ToList();



        foreach (var node in nodes)
        {
            var childNodes =
                nodes
                .Where(x =>
                    x.ParentId == node.Id)
                .ToList();



            if (childNodes.Any())
            {
                node.Budget =
                    childNodes.Sum(
                        x => x.Budget);


                node.ActualCost =
                    childNodes.Sum(
                        x => x.ActualCost);



                node.EarnedValue =
                    childNodes.Sum(x => x.EarnedValue);

                node.PlannedValue =
                    childNodes.Sum(x => x.PlannedValue);

                node.Progress =
                    node.Budget == 0
                    ? 0
                    :
                    (node.EarnedValue / node.Budget) * 100m;
            }
        }
    }





    public ExportPmsDto CalculateProjectKpi(
        Guid projectId,
        IEnumerable<WbsNode> wbsNodes,
        IEnumerable<Activity> activities)
    {
        var activityList =
            activities.ToList();



        CalculateActivities(
            activityList);



        var wbsList =
            wbsNodes.ToList();



        CalculateWbsRollup(
            wbsList);



        decimal budget =
            activityList.Sum(
                x => x.Budget);



        decimal ev =
            activityList.Sum(
                x => x.EarnedValue);



        decimal ac =
            activityList.Sum(
                x => x.ActualCost);



        decimal progress =
            budget == 0
            ? 0
            :
            (ev / budget) * 100m;



        // Planned Value must come from an approved, time-phased baseline.
        // Never infer it from a fixed percentage of the project budget.
        // WBS PlannedValue is the current supported source; when no baseline
        // PV has been populated, report zero rather than fabricated data.
        decimal pv =
            wbsList
                .Where(x => x.ParentId == null)
                .Sum(x => x.PlannedValue);



        return new ExportPmsDto
        {
            ProjectId =
                projectId,


            TotalBudget =
                budget,


            EarnedValue =
                ev,


            ActualCost =
                ac,


            PlannedValue =
                pv,


            CostVariance =
                ev - ac,


            ScheduleVariance =
                ev - pv,


            CPI =
                ac == 0
                ? 0
                :
                ev / ac,


            SPI =
                pv == 0
                ? 0
                :
                ev / pv,


            OverallProgress =
                Math.Round(
                    progress,
                    2),


            TotalActivities =
                activityList.Count,


            TotalWbsNodes =
                wbsList.Count
        };
    }
}