using PCS.Application.Common.Interfaces;
using PCS.Application.Planning.DTOs;
using PCS.Application.Planning.Interfaces;
using PCS.Domain.Entities.Planning;

namespace PCS.Application.Planning.Services;

public class ProgressEntryService : IProgressEntryService
{
    private readonly IGenericRepository<ProgressEntry> _repository;
    private readonly IGenericRepository<Activity> _activityRepository;
    private readonly IPmsBaselineService _baselineService;


    public ProgressEntryService(
        IGenericRepository<ProgressEntry> repository,
        IGenericRepository<Activity> activityRepository,
        IPmsBaselineService baselineService)
    {
        _repository = repository;
        _activityRepository = activityRepository;
        _baselineService = baselineService;
    }



    public async Task AddProgressAsync(
        Guid activityId,
        DateTime date,
        decimal progress,
        decimal actualCost)
    {
        if (activityId == Guid.Empty)
            throw new ArgumentException("ActivityId is required.", nameof(activityId));

        if (date == default)
            throw new ArgumentException("Progress date is required.", nameof(date));

        if (progress < 0m || progress > 100m)
            throw new ArgumentOutOfRangeException(nameof(progress), "Progress must be between 0 and 100.");

        if (actualCost < 0m)
            throw new ArgumentOutOfRangeException(nameof(actualCost), "Actual Cost cannot be negative.");

        var activity =
            (await _activityRepository.GetAllAsync())
            .FirstOrDefault(x => x.Id == activityId);


        if (activity == null)
            throw new Exception("Activity not found");



        var activeBaseline = await _baselineService.GetActiveSnapshotAsync(activity.ProjectId);
        var baselineActivity = activeBaseline?.Activities
            .FirstOrDefault(x => x.ActivityId == activity.Id);

        var baselineBudget = baselineActivity?.Budget ?? 0m;
        var earnedValue = baselineBudget * progress / 100m;
        var plannedValue = baselineActivity == null
            ? 0m
            : PmsBaselineCalculator.CalculateActivityPlannedValue(
                baselineActivity,
                date.Date);



        var entry = new ProgressEntry
        {
            ActivityId = activityId,

            ProgressDate = date,

            Progress = progress,

            ActualCost = actualCost,

            EarnedValue = earnedValue,

            PlannedValue = plannedValue
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

                EarnedValue = x.EarnedValue,

                PlannedValue = x.PlannedValue
            })
            .ToList();
    }
}
