using PCS.Application.Planning.DTOs;
using PCS.Application.Planning.Interfaces;

namespace PCS.Application.Planning.Services;

public sealed class WbsCalculationService
    : IWbsCalculationService
{
    public List<WbsNodeDto> Calculate(
        List<WbsNodeDto> nodes,
        List<ActivityDto> activities)
    {
        if(nodes.Count == 0)
            return nodes;



        var lookup =
            nodes.ToDictionary(
                x => x.Id);



        var codeLookup =
            nodes.ToDictionary(
                x => x.Code,
                StringComparer.OrdinalIgnoreCase);





        // =====================================================
        // Reset Calculated Values
        // =====================================================

        foreach(var node in nodes)
        {
            node.Budget = 0;

            node.ActualCost = 0;

            node.EarnedValue = 0;

            node.PlannedValue = 0;


            node.WeightFactor = 0;

            node.WeightValue = 0;


            node.Progress = 0;
        }






        // =====================================================
        // Activity Aggregation
        // =====================================================

        foreach(var activity in activities)
        {
            if(!codeLookup.TryGetValue(
                    activity.WbsCode,
                    out var wbs))
            {
                continue;
            }



            wbs.Budget +=
                activity.Budget;



            wbs.ActualCost +=
                activity.ActualCost;



            wbs.EarnedValue +=
                activity.EarnedValue;



            wbs.PlannedValue +=
                activity.PlannedValue;
        }








        // =====================================================
        // Bottom-Up Rollup
        // =====================================================

        foreach(var node in nodes
            .OrderByDescending(
                x => x.Level))
        {

            if(!node.ParentId.HasValue)
                continue;



            if(!lookup.TryGetValue(
                    node.ParentId.Value,
                    out var parent))
            {
                continue;
            }




            parent.Budget +=
                node.Budget;



            parent.ActualCost +=
                node.ActualCost;



            parent.EarnedValue +=
                node.EarnedValue;



            parent.PlannedValue +=
                node.PlannedValue;
        }








        // =====================================================
        // Total Project Budget
        // =====================================================

        var projectBudget =
            nodes
            .Where(x =>
                x.ParentId == null)
            .Sum(x =>
                x.Budget);




        if(projectBudget == 0)
            return nodes;








        // =====================================================
        // W.F / W.V / Progress
        // =====================================================

        foreach(var node in nodes)
        {

            // -------------------------------------------------
            // W.V
            // Budget / Total Project Budget
            // -------------------------------------------------

            node.WeightValue =
                (
                    node.Budget /
                    projectBudget
                )
                * 100m;






            // -------------------------------------------------
            // W.F
            // Budget / Parent Budget
            // -------------------------------------------------

            if(node.ParentId.HasValue &&
               lookup.TryGetValue(
                    node.ParentId.Value,
                    out var parent))
            {

                node.WeightFactor =
                    parent.Budget == 0
                    ? 0
                    :
                    (
                        node.Budget /
                        parent.Budget
                    )
                    * 100m;

            }
            else
            {

                // Root WBS
                node.WeightFactor =
                    100m;

            }






            // -------------------------------------------------
            // Progress
            // EV / Budget
            // -------------------------------------------------

            node.Progress =
                node.Budget == 0
                ? 0
                :
                (
                    node.EarnedValue /
                    node.Budget
                )
                * 100m;

        }





        return nodes;
    }
}