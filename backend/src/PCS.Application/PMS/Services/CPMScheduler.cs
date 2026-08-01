using PCS.Application.PMS.DTOs;
using PCS.Application.PMS.Interfaces;
using PCS.Domain.Entities.PMS;

namespace PCS.Application.PMS.Services;

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



        foreach(var activity in activities)
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



        var indegree =
            activities.ToDictionary(
                x => x.Id,
                x => 0);



        foreach(var relation in relationships)
        {
            if(indegree.ContainsKey(
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



        while(queue.Count > 0)
        {
            var current =
                queue.Dequeue();


            result.Add(current);



            foreach(var relation in relationships
                .Where(x =>
                    x.PredecessorId == current.Id))
            {
                indegree[relation.SuccessorId]--;


                if(indegree[relation.SuccessorId] == 0)
                {
                    queue.Enqueue(
                        activities.First(
                            x =>
                            x.Id == relation.SuccessorId));
                }
            }
        }


        return result;
    }






    public async Task ForwardPassAsync(
        Guid projectId)
    {
        var activities =
            await TopologicalSortAsync(projectId);


        foreach(var activity in activities)
        {
            var predecessors =
                await _relationshipRepository
                .GetPredecessorsAsync(activity.Id);



            activity.EarlyStart =
                predecessors.Any()
                ?
                predecessors.Max(
                    x =>
                    x.Predecessor.EarlyFinish
                    + x.Lag)
                :
                0;



            activity.EarlyFinish =
                activity.EarlyStart
                +
                activity.Duration;


            _activityRepository.Update(activity);
        }



        await _activityRepository.SaveChangesAsync();
    }






    public async Task BackwardPassAsync(
        Guid projectId)
    {
        var activities =
            await LoadActivities(projectId);



        var projectFinish =
            activities.Max(
                x => x.EarlyFinish);



        foreach(var activity in activities
            .OrderByDescending(
                x => x.EarlyFinish))
        {
            var successors =
                await _relationshipRepository
                .GetSuccessorsAsync(activity.Id);



            activity.LateFinish =
                successors.Any()
                ?
                successors.Min(
                    x =>
                    x.Successor.LateStart
                    - x.Lag)
                :
                projectFinish;



            activity.LateStart =
                activity.LateFinish
                -
                activity.Duration;


            _activityRepository.Update(activity);
        }



        await _activityRepository.SaveChangesAsync();
    }






    public async Task CalculateFloatAsync(
        Guid projectId)
    {
        var activities =
            await LoadActivities(projectId);



        foreach(var activity in activities)
        {
            activity.TotalFloat =
                activity.LateStart
                -
                activity.EarlyStart;



            activity.FreeFloat =
                activity.TotalFloat;


            _activityRepository.Update(activity);
        }



        await _activityRepository.SaveChangesAsync();
    }






    public async Task DetectCriticalPathAsync(
        Guid projectId)
    {
        var activities =
            await LoadActivities(projectId);



        foreach(var activity in activities)
        {
            activity.IsCritical =
                activity.TotalFloat == 0;


            _activityRepository.Update(activity);
        }



        await _activityRepository.SaveChangesAsync();
    }
}