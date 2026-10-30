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

        // Build the hierarchy from ParentId, not Level. Imported WBS levels can
        // be stale or inconsistent, while ParentId is the authoritative link.
        var childrenByParent = nodes
            .Where(node =>
                node.ParentId.HasValue &&
                lookup.ContainsKey(node.ParentId.Value))
            .GroupBy(node => node.ParentId!.Value)
            .ToDictionary(
                group => group.Key,
                group => group
                    .OrderBy(child => child.SortOrder)
                    .ThenBy(child => child.Code, StringComparer.OrdinalIgnoreCase)
                    .ToList());

        // Produce a child-before-parent order and reject cycles explicitly.
        // Without this validation, cyclic WBS data can silently produce zero
        // project budget or incomplete roll-ups.
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

        // Missing-parent nodes are treated as roots. Visiting all remaining
        // nodes afterwards also detects disconnected cyclic components.
        foreach (var root in nodes.Where(node =>
                     !node.ParentId.HasValue ||
                     !lookup.ContainsKey(node.ParentId.Value)))
        {
            Visit(root);
        }

        foreach (var node in nodes)
            Visit(node);

        // Child rows are now guaranteed to be processed before their parents,
        // regardless of the numeric Level stored on either row.
        foreach (var node in postOrder)
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
            .Where(node =>
                !node.ParentId.HasValue ||
                !lookup.ContainsKey(node.ParentId.Value))
            .ToList();

        var projectBudget = roots.Sum(node => node.Budget);
        if (projectBudget <= 0m)
            return nodes;

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
