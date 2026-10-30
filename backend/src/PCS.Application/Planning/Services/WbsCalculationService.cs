using PCS.Application.Planning.DTOs;
using PCS.Application.Planning.Interfaces;

namespace PCS.Application.Planning.Services;

public sealed class WbsCalculationService : IWbsCalculationService
{
    public List<WbsNodeDto> Calculate(
        List<WbsNodeDto> nodes,
        List<ActivityDto> activities)
    {
        ArgumentNullException.ThrowIfNull(nodes);
        ArgumentNullException.ThrowIfNull(activities);

        if (nodes.Count == 0)
        {
            if (activities.Count > 0)
            {
                throw new InvalidOperationException(
                    "Activities cannot be calculated without WBS nodes.");
            }

            return nodes;
        }

        var lookup = nodes.ToDictionary(x => x.Id);
        var physicalProgressValueByWbs = nodes.ToDictionary(
            x => x.Id,
            _ => 0m);

        // Reset calculated values so repeated calculations are deterministic.
        foreach (var node in nodes)
        {
            node.Budget = 0m;
            node.ActualCost = 0m;
            node.EarnedValue = 0m;
            node.PlannedValue = 0m;
            node.WeightFactor = 0m;
            node.WeightValue = 0m;
            node.Progress = 0m;
        }

        // Activity-to-WBS assignment is based on the persisted foreign key,
        // never on a mutable/display-oriented WBS code.
        foreach (var activity in activities)
        {
            if (activity.WbsNodeId == Guid.Empty ||
                !lookup.TryGetValue(activity.WbsNodeId, out var wbs))
            {
                throw new InvalidOperationException(
                    $"Activity '{activity.Code}' references WBS node " +
                    $"'{activity.WbsNodeId}' which is not part of this calculation.");
            }

            wbs.Budget += activity.Budget;
            wbs.ActualCost += activity.ActualCost;
            wbs.EarnedValue += activity.EarnedValue;
            wbs.PlannedValue += activity.PlannedValue;

            physicalProgressValueByWbs[wbs.Id] +=
                activity.Budget * Math.Clamp(activity.Progress, 0m, 100m) / 100m;
        }

        // Roll up from the deepest WBS level to its ancestors.
        foreach (var node in nodes.OrderByDescending(x => x.Level))
        {
            if (!node.ParentId.HasValue ||
                !lookup.TryGetValue(node.ParentId.Value, out var parent))
            {
                continue;
            }

            parent.Budget += node.Budget;
            parent.ActualCost += node.ActualCost;
            parent.EarnedValue += node.EarnedValue;
            parent.PlannedValue += node.PlannedValue;
            physicalProgressValueByWbs[parent.Id] +=
                physicalProgressValueByWbs[node.Id];
        }

        // Treat nodes with a missing parent as roots as well. This prevents
        // malformed/orphaned hierarchy references from disappearing from totals.
        var roots = nodes
            .Where(x =>
                !x.ParentId.HasValue ||
                !lookup.ContainsKey(x.ParentId.Value))
            .ToList();

        var projectBudget = roots.Sum(x => x.Budget);
        if (projectBudget <= 0m)
        {
            return nodes;
        }

        foreach (var node in nodes)
        {
            node.WeightValue = node.Budget / projectBudget * 100m;

            if (node.ParentId.HasValue &&
                lookup.TryGetValue(node.ParentId.Value, out var parent))
            {
                node.WeightFactor = parent.Budget <= 0m
                    ? 0m
                    : node.Budget / parent.Budget * 100m;
            }
            else
            {
                node.WeightFactor = 100m;
            }

            node.Progress = node.Budget <= 0m
                ? 0m
                : Math.Clamp(
                    physicalProgressValueByWbs[node.Id] / node.Budget * 100m,
                    0m,
                    100m);
        }

        return nodes;
    }
}
