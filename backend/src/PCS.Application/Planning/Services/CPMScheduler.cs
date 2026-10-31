using PCS.Application.Planning.DTOs;
using PCS.Application.Planning.Interfaces;
using PCS.Domain.Entities.Planning;

namespace PCS.Application.Planning.Services;

public class CpmScheduler : ICpmScheduler
{
    private readonly IActivityRepository _activityRepository;
    private readonly IActivityRelationshipRepository _relationshipRepository;

    public CpmScheduler(
        IActivityRepository activityRepository,
        IActivityRelationshipRepository relationshipRepository)
    {
        _activityRepository = activityRepository;
        _relationshipRepository = relationshipRepository;
    }

    private async Task<List<Activity>> LoadActivities(
        Guid projectId)
    {
        if (projectId == Guid.Empty)
            throw new ArgumentException("ProjectId is required.", nameof(projectId));

        var activities = await _activityRepository
            .GetProjectActivitiesAsync(projectId);

        var invalidActivity = activities.FirstOrDefault(x =>
            x.Duration < 0 || x.ProjectId != projectId);

        if (invalidActivity is not null)
        {
            throw new InvalidOperationException(
                invalidActivity.Duration < 0
                    ? $"Activity '{invalidActivity.Code}' has a negative duration."
                    : $"Activity '{invalidActivity.Code}' does not belong to project '{projectId}'.");
        }

        return activities;
    }

    private async Task<List<ActivityRelationship>> LoadRelationships(
        Guid projectId,
        IReadOnlyCollection<Activity> activities)
    {
        var relationships =
            await _relationshipRepository
                .GetByProjectAsync(projectId);

        return CpmNetworkValidator.Validate(
                projectId,
                activities,
                relationships)
            .ToList();
    }

    private static string NormalizeRelationshipType(
        ActivityRelationship relationship)
    {
        return relationship.Type
            .Trim()
            .ToUpperInvariant();
    }

    public async Task<CpmResultDto> ScheduleProjectAsync(
        Guid projectId)
    {
        await ForwardPassAsync(projectId);

        await BackwardPassAsync(projectId);

        await CalculateFloatAsync(projectId);

        await DetectCriticalPathAsync(projectId);

        var activities =
            await LoadActivities(projectId);

        var projectDuration =
            activities.Any()
                ? activities.Max(x => x.EarlyFinish)
                : 0;

        var result = new CpmResultDto
        {
            ProjectId = projectId,
            ProjectDuration = Math.Max(0, projectDuration),
            TotalActivities = activities.Count
        };

        foreach (var activity in activities)
        {
            result.Activities.Add(
                new CpmActivityDto
                {
                    Id = activity.Id,
                    Code = activity.Code,
                    Name = activity.Name,
                    Duration = Math.Max(0, activity.Duration),
                    EarlyStart = activity.EarlyStart,
                    EarlyFinish = activity.EarlyFinish,
                    LateStart = activity.LateStart,
                    LateFinish = activity.LateFinish,
                    TotalFloat = activity.TotalFloat,
                    FreeFloat = activity.FreeFloat,
                    IsCritical = activity.IsCritical
                });
        }

        result.CriticalPath =
            activities
                .Where(x => x.IsCritical)
                .OrderBy(x => x.EarlyStart)
                .ThenBy(x => x.EarlyFinish)
                .ThenBy(x => x.Code)
                .Select(x => x.Code)
                .ToList();

        result.CriticalActivitiesCount =
            result.CriticalPath.Count;

        return result;
    }

    public async Task<List<Activity>> TopologicalSortAsync(
        Guid projectId)
    {
        var activities =
            await LoadActivities(projectId);

        var relationships =
            await LoadRelationships(projectId, activities);

        var activityMap =
            activities.ToDictionary(x => x.Id);

        var validRelationships =
            relationships
                .Where(x =>
                    activityMap.ContainsKey(x.PredecessorId) &&
                    activityMap.ContainsKey(x.SuccessorId))
                .ToList();

        var indegree =
            activities.ToDictionary(
                x => x.Id,
                _ => 0);

        foreach (var relation in validRelationships)
        {
            indegree[relation.SuccessorId]++;
        }

        var queue =
            new Queue<Activity>(
                activities
                    .Where(x => indegree[x.Id] == 0)
                    .OrderBy(x => x.Code));

        var result =
            new List<Activity>(activities.Count);

        var outgoing =
            validRelationships
                .GroupBy(x => x.PredecessorId)
                .ToDictionary(
                    x => x.Key,
                    x => x.ToList());

        while (queue.Count > 0)
        {
            var current =
                queue.Dequeue();

            result.Add(current);

            if (!outgoing.TryGetValue(
                    current.Id,
                    out var successors))
            {
                continue;
            }

            foreach (var relation in successors)
            {
                indegree[relation.SuccessorId]--;

                if (indegree[relation.SuccessorId] == 0)
                {
                    queue.Enqueue(
                        activityMap[relation.SuccessorId]);
                }
            }
        }

        if (result.Count != activities.Count)
        {
            throw new InvalidOperationException(
                "CPM calculation failed. Activity network contains cycle.");
        }

        return result;
    }

    public async Task ForwardPassAsync(
        Guid projectId)
    {
        var orderedActivities =
            await TopologicalSortAsync(projectId);

        var relationships =
            await LoadRelationships(projectId, orderedActivities);

        var activityMap =
            orderedActivities.ToDictionary(x => x.Id);

        var incoming =
            relationships
                .Where(x =>
                    activityMap.ContainsKey(x.PredecessorId) &&
                    activityMap.ContainsKey(x.SuccessorId))
                .GroupBy(x => x.SuccessorId)
                .ToDictionary(
                    x => x.Key,
                    x => x.ToList());

        foreach (var activity in orderedActivities)
        {
            var duration =
                Math.Max(0, activity.Duration);

            if (!incoming.TryGetValue(
                    activity.Id,
                    out var predecessors))
            {
                activity.EarlyStart = 0;
                activity.EarlyFinish = duration;

                _activityRepository.Update(activity);
                continue;
            }

            var earliestStart = 0;

            foreach (var relationship in predecessors)
            {
                var predecessor =
                    activityMap[relationship.PredecessorId];

                var lag =
                    relationship.Lag;

                var type =
                    NormalizeRelationshipType(
                        relationship);

                var candidateStart =
                    type switch
                    {
                        // Successor Start >= Predecessor Finish + Lag
                        "FS" =>
                            predecessor.EarlyFinish + lag,

                        // Successor Start >= Predecessor Start + Lag
                        "SS" =>
                            predecessor.EarlyStart + lag,

                        // Successor Finish >= Predecessor Finish + Lag
                        "FF" =>
                            predecessor.EarlyFinish
                            + lag
                            - duration,

                        // Successor Finish >= Predecessor Start + Lag
                        "SF" =>
                            predecessor.EarlyStart
                            + lag
                            - duration,

                        _ => throw new InvalidOperationException(
                            $"Unsupported relationship type '{relationship.Type}'.")
                    };

                earliestStart =
                    Math.Max(
                        earliestStart,
                        candidateStart);
            }

            activity.EarlyStart =
                Math.Max(0, earliestStart);

            activity.EarlyFinish =
                activity.EarlyStart + duration;

            _activityRepository.Update(activity);
        }

        await _activityRepository
            .SaveChangesAsync();
    }

    public async Task BackwardPassAsync(
        Guid projectId)
    {
        var orderedActivities =
            await TopologicalSortAsync(projectId);

        var activities = orderedActivities;

        var relationships =
            await LoadRelationships(projectId, orderedActivities);

        var activityMap =
            activities.ToDictionary(x => x.Id);

        var projectFinish =
            activities.Any()
                ? activities.Max(x => x.EarlyFinish)
                : 0;

        var outgoing =
            relationships
                .Where(x =>
                    activityMap.ContainsKey(x.PredecessorId) &&
                    activityMap.ContainsKey(x.SuccessorId))
                .GroupBy(x => x.PredecessorId)
                .ToDictionary(
                    x => x.Key,
                    x => x.ToList());

        var reversedActivities =
            orderedActivities
                .AsEnumerable()
                .Reverse()
                .ToList();

        foreach (var activity in reversedActivities)
        {
            var duration =
                Math.Max(0, activity.Duration);

            if (!outgoing.TryGetValue(
                    activity.Id,
                    out var successors))
            {
                activity.LateFinish =
                    projectFinish;

                activity.LateStart =
                    activity.LateFinish - duration;

                _activityRepository.Update(activity);
                continue;
            }

            var latestFinish =
                int.MaxValue;

            foreach (var relationship in successors)
            {
                var successor =
                    activityMap[relationship.SuccessorId];

                var lag =
                    relationship.Lag;

                var type =
                    NormalizeRelationshipType(
                        relationship);

                var candidateFinish =
                    type switch
                    {
                        // Predecessor Finish <= Successor Start - Lag
                        "FS" =>
                            successor.LateStart - lag,

                        // Predecessor Start <= Successor Start - Lag
                        // LF = LS + Duration
                        "SS" =>
                            successor.LateStart
                            - lag
                            + duration,

                        // Predecessor Finish <= Successor Finish - Lag
                        "FF" =>
                            successor.LateFinish - lag,

                        // Predecessor Start <= Successor Finish - Lag
                        // LF = LS + Duration
                        "SF" =>
                            successor.LateFinish
                            - lag
                            + duration,

                        _ => throw new InvalidOperationException(
                            $"Unsupported relationship type '{relationship.Type}'.")
                    };

                latestFinish =
                    Math.Min(
                        latestFinish,
                        candidateFinish);
            }

            activity.LateFinish =
                latestFinish == int.MaxValue
                    ? projectFinish
                    : latestFinish;

            activity.LateStart =
                activity.LateFinish - duration;

            _activityRepository.Update(activity);
        }

        await _activityRepository
            .SaveChangesAsync();
    }

    public async Task CalculateFloatAsync(
        Guid projectId)
    {
        var activities =
            await LoadActivities(projectId);

        var relationships =
            await LoadRelationships(projectId, activities);

        var activityMap =
            activities.ToDictionary(x => x.Id);

        var outgoing =
            relationships
                .Where(x =>
                    activityMap.ContainsKey(x.PredecessorId) &&
                    activityMap.ContainsKey(x.SuccessorId))
                .GroupBy(x => x.PredecessorId)
                .ToDictionary(
                    x => x.Key,
                    x => x.ToList());

        foreach (var activity in activities)
        {
            activity.TotalFloat =
                activity.LateStart
                - activity.EarlyStart;

            if (!outgoing.TryGetValue(
                    activity.Id,
                    out var successors))
            {
                activity.FreeFloat =
                    activity.TotalFloat;

                activity.DrivingFloat =
                    activity.TotalFloat;

                _activityRepository.Update(activity);
                continue;
            }

            var freeFloatCandidates =
                new List<int>();

            foreach (var relationship in successors)
            {
                var successor =
                    activityMap[relationship.SuccessorId];

                var lag =
                    relationship.Lag;

                var type =
                    NormalizeRelationshipType(
                        relationship);

                var candidateFreeFloat =
                    type switch
                    {
                        // Successor ES >= Predecessor EF + Lag
                        "FS" =>
                            successor.EarlyStart
                            - activity.EarlyFinish
                            - lag,

                        // Successor ES >= Predecessor ES + Lag
                        "SS" =>
                            successor.EarlyStart
                            - activity.EarlyStart
                            - lag,

                        // Successor EF >= Predecessor EF + Lag
                        "FF" =>
                            successor.EarlyFinish
                            - activity.EarlyFinish
                            - lag,

                        // Successor EF >= Predecessor ES + Lag
                        "SF" =>
                            successor.EarlyFinish
                            - activity.EarlyStart
                            - lag,

                        _ => throw new InvalidOperationException(
                            $"Unsupported relationship type '{relationship.Type}'.")
                    };

                freeFloatCandidates.Add(
                    candidateFreeFloat);
            }

            activity.FreeFloat =
                freeFloatCandidates.Min();

            /*
             * Driving Float represents the tightest active
             * successor relationship. A negative value therefore
             * identifies a driving negative-float relationship.
             */
            activity.DrivingFloat =
                freeFloatCandidates.Min();

            _activityRepository.Update(activity);
        }

        await _activityRepository
            .SaveChangesAsync();
    }

    public async Task DetectCriticalPathAsync(
        Guid projectId)
    {
        var activities =
            await LoadActivities(projectId);

        foreach (var activity in activities)
        {
            /*
             * Zero and negative total float are treated as critical.
             *
             * TF =  5  -> Non-critical
             * TF =  0  -> Critical
             * TF = -3  -> Critical / Negative Float
             */
            activity.IsCritical =
                activity.TotalFloat <= 0;

            _activityRepository.Update(activity);
        }

        await _activityRepository
            .SaveChangesAsync();
    }
}