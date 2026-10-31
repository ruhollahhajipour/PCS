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

        if (nodes.Any(node => node.Id == Guid.Empty))
        {
            throw new InvalidOperationException(
                "Every WBS node must have a persisted identifier.");
        }

        var lookup = nodes.ToDictionary(node => node.Id);
        var physicalProgressValueByWbs = nodes.ToDictionary(
            node => node.Id,
            _ => 0m);

        foreach (var node in nodes)
        {
            node.Budget = 0m;
            node.ActualCost = 0m;
            node.EarnedValue = 0m;
            node.PlannedValue = 0m;
            node.WeightFactor = 0m;
            node.WeightValue = 0m;
            node.Progress = 0m;

            if (node.ParentId.HasValue &&
                !lookup.ContainsKey(node.ParentId.Value))
            {
                throw new InvalidOperationException(
                    $"WBS node '{node.Code}' references missing parent '{node.ParentId}'.");
            }
        }

        // Activity ownership is a relational concern: use the persisted WBS ID,
        // never the mutable/display-oriented WBS code.
        foreach (var activity in activities)
        {
            if (!activity.WbsNodeId.HasValue ||
                activity.WbsNodeId.Value == Guid.Empty ||
                !lookup.TryGetValue(activity.WbsNodeId.Value, out var wbs))
            {
                throw new InvalidOperationException(
                    $"Activity '{activity.Code}' references a missing or invalid WBS node " +
                    $"'{activity.WbsNodeId}'.");
            }

            wbs.Budget += activity.Budget;
            wbs.ActualCost += activity.ActualCost;
            wbs.EarnedValue += activity.EarnedValue;
            wbs.PlannedValue += activity.PlannedValue;

            physicalProgressValueByWbs[wbs.Id] +=
                activity.Budget * Math.Clamp(activity.Progress, 0m, 100m) / 100m;
        }

        var childrenByParent = nodes
            .Where(node => node.ParentId.HasValue)
            .GroupBy(node => node.ParentId!.Value)
            .ToDictionary(
                group => group.Key,
                group => group
                    .OrderBy(child => child.SortOrder)
                    .ThenBy(child => child.Code, StringComparer.OrdinalIgnoreCase)
                    .ToList());

        // ParentId is authoritative; Level is display metadata and may be stale.
        // A post-order traversal makes roll-up independent of input row order.
        var visitStateById = new Dictionary<Guid, byte>();
        var postOrder = new List<WbsNodeDto>(nodes.Count);

        void Visit(WbsNodeDto node)
        {
            if (visitStateById.TryGetValue(node.Id, out var state))
            {
                if (state == 1)
                {
                    throw new InvalidOperationException(
                        $"WBS hierarchy contains a cycle at node '{node.Code}' ({node.Id}).");
                }

                if (state == 2)
                    return;
            }

            visitStateById[node.Id] = 1;

            if (childrenByParent.TryGetValue(node.Id, out var children))
            {
                foreach (var child in children)
                    Visit(child);
            }

            visitStateById[node.Id] = 2;
            postOrder.Add(node);
        }

        foreach (var root in nodes.Where(node => !node.ParentId.HasValue))
            Visit(root);

        // Also visit any disconnected component so a rootless cycle is rejected.
        foreach (var node in nodes)
            Visit(node);

        foreach (var node in postOrder)
        {
            if (!node.ParentId.HasValue)
                continue;

            var parent = lookup[node.ParentId.Value];
            parent.Budget += node.Budget;
            parent.ActualCost += node.ActualCost;
            parent.EarnedValue += node.EarnedValue;
            parent.PlannedValue += node.PlannedValue;
            physicalProgressValueByWbs[parent.Id] +=
                physicalProgressValueByWbs[node.Id];
        }

        var projectBudget = nodes
            .Where(node => !node.ParentId.HasValue)
            .Sum(node => node.Budget);

        // Zero-budget progress policy remains explicitly zero until the project
        // defines an approved non-financial weighting basis.
        if (projectBudget <= 0m)
            return nodes;

        foreach (var node in nodes)
        {
            node.WeightValue = node.Budget / projectBudget * 100m;

            node.WeightFactor = node.ParentId.HasValue
                ? lookup[node.ParentId.Value].Budget <= 0m
                    ? 0m
                    : node.Budget / lookup[node.ParentId.Value].Budget * 100m
                : 100m;

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