using PCS.Application.Common.Interfaces;
using PCS.Application.Planning.DTOs;
using PCS.Application.Planning.Interfaces;
using PCS.Domain.Entities.Planning;

namespace PCS.Application.Planning.Services;

public sealed class PmsProgressService : IPmsProgressService
{
    private readonly IGenericRepository<WbsNode> _wbsRepository;
    private readonly IGenericRepository<Activity> _activityRepository;
    private readonly IPmsBaselineService _baselineService;

    public PmsProgressService(
        IGenericRepository<WbsNode> wbsRepository,
        IGenericRepository<Activity> activityRepository,
        IPmsBaselineService baselineService)
    {
        _wbsRepository = wbsRepository;
        _activityRepository = activityRepository;
        _baselineService = baselineService;
    }

    public async Task<decimal> CalculateWbsProgressAsync(Guid wbsNodeId)
    {
        if (wbsNodeId == Guid.Empty)
            throw new ArgumentException("WbsNodeId is required.", nameof(wbsNodeId));

        var nodes = (await _wbsRepository.GetAllAsync())
            .Where(x => !x.IsDeleted)
            .ToList();

        var nodeById = nodes.ToDictionary(x => x.Id);
        if (!nodeById.TryGetValue(wbsNodeId, out var requestedNode))
            return 0m;

        nodes = nodes
            .Where(x => x.ProjectId == requestedNode.ProjectId)
            .ToList();

        // Include the requested WBS and all nested work packages. A visited set
        // protects the calculation from malformed cyclic hierarchy references.
        var childrenByParent = nodes
            .Where(x => x.ParentId.HasValue)
            .GroupBy(x => x.ParentId!.Value)
            .ToDictionary(
                group => group.Key,
                group => group.Select(x => x.Id).ToList());

        var descendantIds = new HashSet<Guid> { wbsNodeId };
        var pending = new Queue<Guid>();
        pending.Enqueue(wbsNodeId);

        while (pending.Count > 0)
        {
            var parentId = pending.Dequeue();
            if (!childrenByParent.TryGetValue(parentId, out var childIds))
                continue;

            foreach (var childId in childIds)
            {
                if (descendantIds.Add(childId))
                    pending.Enqueue(childId);
            }
        }

        var activities = (await _activityRepository.GetAllAsync())
            .Where(x =>
                x.ProjectId == requestedNode.ProjectId &&
                !x.IsDeleted &&
                descendantIds.Contains(x.WbsNodeId))
            .ToList();

        var baseline = await _baselineService.GetActiveSnapshotAsync(requestedNode.ProjectId);
        return CalculateWeightedProgress(activities, baseline, useProjectBudget: false);
    }

    public async Task<decimal> CalculateProjectProgressAsync(Guid projectId)
    {
        if (projectId == Guid.Empty)
            throw new ArgumentException("ProjectId is required.", nameof(projectId));

        var activities = (await _activityRepository.GetAllAsync())
            .Where(x => x.ProjectId == projectId && !x.IsDeleted)
            .ToList();

        var baseline = await _baselineService.GetActiveSnapshotAsync(projectId);
        return CalculateWeightedProgress(activities, baseline, useProjectBudget: true);
    }

    private static decimal CalculateWeightedProgress(
        IReadOnlyCollection<Activity> activities,
        ProjectBaselineSnapshotDto? baseline,
        bool useProjectBudget)
    {
        if (activities.Count == 0)
            return 0m;

        var baselineBudgetByActivity = baseline?.Activities
            .ToDictionary(x => x.ActivityId, x => x.Budget)
            ?? new Dictionary<Guid, decimal>();

        decimal GetBudget(Activity activity) =>
            baseline is null
                ? activity.Budget
                : baselineBudgetByActivity.GetValueOrDefault(activity.Id);

        var totalBudget = useProjectBudget && baseline is not null
            ? baseline.TotalBudget
            : activities.Sum(GetBudget);

        if (totalBudget <= 0m)
            return 0m;

        var earnedProgressValue = activities.Sum(activity =>
            GetBudget(activity) * Math.Clamp(activity.Progress, 0m, 100m) / 100m);

        return Math.Round(
            earnedProgressValue / totalBudget * 100m,
            2,
            MidpointRounding.AwayFromZero);
    }
}
