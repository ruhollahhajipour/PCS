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
            // Earned Value requires an approved baseline budget.
            activity.EarnedValue = 0m;
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



                var ev =
                    childNodes.Sum(
                        x =>
                        x.Budget *
                        (x.Progress / 100m));



                node.Progress =
                    node.Budget == 0
                    ? 0
                    :
                    (ev / node.Budget) * 100m;
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



        // This legacy synchronous calculator has no approved baseline input.
        // Keep physical progress available, but do not publish un-baselined EVM values.
        decimal ev = 0m;



        decimal ac =
            activityList.Sum(
                x => x.ActualCost);



        decimal physicalProgressValue = activityList.Sum(
            x => x.Budget * Math.Clamp(x.Progress, 0m, 100m) / 100m);

        decimal progress = budget == 0
            ? 0
            : physicalProgressValue / budget * 100m;



        decimal pv = 0m;



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


            CostVariance = 0m,


            ScheduleVariance = 0m,


            CPI = 0m,


            SPI = 0m,


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