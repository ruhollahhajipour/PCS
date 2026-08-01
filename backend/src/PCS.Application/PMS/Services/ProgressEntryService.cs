using PCS.Application.Common.Interfaces;
using PCS.Application.PMS.DTOs;
using PCS.Application.PMS.Interfaces;
using PCS.Domain.Entities.PMS;

namespace PCS.Application.PMS.Services;

public class ProgressEntryService : IProgressEntryService
{
    private readonly IGenericRepository<ProgressEntry> _repository;
    private readonly IGenericRepository<Activity> _activityRepository;


    public ProgressEntryService(
        IGenericRepository<ProgressEntry> repository,
        IGenericRepository<Activity> activityRepository)
    {
        _repository = repository;
        _activityRepository = activityRepository;
    }



    public async Task AddProgressAsync(
        Guid activityId,
        DateTime date,
        decimal progress,
        decimal actualCost)
    {
        var activity =
            (await _activityRepository.GetAllAsync())
            .FirstOrDefault(x => x.Id == activityId);


        if (activity == null)
            throw new Exception("Activity not found");



        var earnedValue =
            activity.Budget * progress / 100;



        var entry = new ProgressEntry
        {
            ActivityId = activityId,

            ProgressDate = date,

            Progress = progress,

            ActualCost = actualCost,

            EarnedValue = earnedValue
        };


        await _repository.AddAsync(entry);

        await _repository.SaveChangesAsync();
    }





    public async Task<List<ProgressEntryDto>> GetActivityProgressAsync(
        Guid activityId)
    {
        var items =
            await _repository.GetAllAsync();


        return items
            .Where(x => x.ActivityId == activityId)
            .Select(x => new ProgressEntryDto
            {
                Id = x.Id,

                ActivityId = x.ActivityId,

                ProgressDate = x.ProgressDate,

                Progress = x.Progress,

                ActualCost = x.ActualCost,

                EarnedValue = x.EarnedValue
            })
            .ToList();
    }
}