using PCS.Application.PMS.DTOs;
using PCS.Application.PMS.Interfaces;

namespace PCS.Application.PMS.Services;

public class PmsGanttService : IPmsGanttService
{
    private readonly IActivityRepository _repository;


    public PmsGanttService(
        IActivityRepository repository)
    {
        _repository = repository;
    }



    public async Task<GanttProjectDto> GetGanttAsync(
        Guid projectId)
    {
        var activities =
            await _repository
            .GetProjectActivitiesAsync(projectId);



        return new GanttProjectDto
        {
            ProjectId = projectId,


            Duration =
                activities.Any()
                ?
                activities.Max(
                    x => x.EarlyFinish)
                :
                0,


            Activities =
                activities
                .OrderBy(
                    x => x.EarlyStart)
                .Select(x =>
                    new GanttActivityDto
                    {
                        Id = x.Id,

                        Code = x.Code,

                        Name = x.Name,

                        Start = x.EarlyStart,

                        Finish = x.EarlyFinish,

                        Duration = x.Duration,

                        Progress = x.Progress,

                        Float = x.TotalFloat,

                        IsCritical = x.IsCritical,

                        IsMilestone = x.IsMilestone
                    })
                .ToList()
        };
    }
}