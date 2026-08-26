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
        return await _activityRepository
            .GetProjectActivitiesAsync(projectId);
    }



    private async Task<List<ActivityRelationship>> LoadRelationships(
        Guid projectId)
    {
        return await _relationshipRepository
            .GetByProjectAsync(projectId);
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



        var result = new CpmResultDto
        {
            ProjectId = projectId,

            ProjectDuration =
                activities.Any()
                ? activities.Max(x => x.EarlyFinish)
                : 0,

            TotalActivities =
                activities.Count
        };



        foreach (var activity in activities)
        {
            result.Activities.Add(
                new CpmActivityDto
                {
                    Id = activity.Id,

                    Code = activity.Code,

                    Name = activity.Name,

                    Duration = activity.Duration,

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
            await LoadRelationships(projectId);



        var activityMap =
            activities.ToDictionary(
                x => x.Id);



        var indegree =
            activities.ToDictionary(
                x => x.Id,
                _ => 0);



        foreach (var relation in relationships)
        {
            if (indegree.ContainsKey(
                relation.SuccessorId))
            {
                indegree[relation.SuccessorId]++;
            }
        }



        var queue =
            new Queue<Activity>(
                activities.Where(
                    x => indegree[x.Id] == 0));



        var result =
            new List<Activity>();



        while (queue.Count > 0)
        {
            var current =
                queue.Dequeue();


            result.Add(current);



            foreach (var relation in relationships
                .Where(x =>
                    x.PredecessorId == current.Id))
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
            await LoadRelationships(projectId);



        foreach (var activity in orderedActivities)
        {
            var predecessors =
                relationships
                .Where(x =>
                    x.SuccessorId == activity.Id)
                .ToList();



            if (!predecessors.Any())
            {
                activity.EarlyStart = 0;
            }
            else
            {
                activity.EarlyStart =
                    predecessors.Max(x =>
                        x.Predecessor.EarlyFinish
                        +
                        x.Lag);
            }



            activity.EarlyFinish =
                activity.EarlyStart
                +
                activity.Duration;



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



        var activities =
            await LoadActivities(projectId);



        var projectFinish =
            activities.Any()
            ?
            activities.Max(
                x => x.EarlyFinish)
            :
            0;



        var relationships =
            await LoadRelationships(projectId);



        var reversedActivities =
            orderedActivities
                .AsEnumerable()
                .Reverse()
                .ToList();



        foreach (var activity in reversedActivities)
        {
            var successors =
                relationships
                .Where(x =>
                    x.PredecessorId == activity.Id)
                .ToList();



            if (!successors.Any())
            {
                activity.LateFinish =
                    projectFinish;
            }
            else
            {
                activity.LateFinish =
                    successors.Min(x =>
                        x.Successor.LateStart
                        -
                        x.Lag);
            }



            activity.LateStart =
                activity.LateFinish
                -
                activity.Duration;



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
            await LoadRelationships(projectId);



        foreach (var activity in activities)
        {
            activity.TotalFloat =
                activity.LateStart
                -
                activity.EarlyStart;



            var successors =
                relationships
                .Where(x =>
                    x.PredecessorId == activity.Id)
                .ToList();



            if (successors.Any())
            {
                activity.FreeFloat =
                    successors.Min(x =>
                        x.Successor.EarlyStart
                        -
                        activity.EarlyFinish);
            }
            else
            {
                activity.FreeFloat =
                    activity.TotalFloat;
            }



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
            activity.IsCritical =
                Math.Abs(activity.TotalFloat) < 0.001;



            _activityRepository.Update(activity);
        }



        await _activityRepository
            .SaveChangesAsync();
    }
}
