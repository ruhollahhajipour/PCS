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

        if (date.Date > DateTime.UtcNow.Date)
            throw new ArgumentOutOfRangeException(nameof(date), "A progress entry cannot be dated in the future.");

        if (progress < 0m || progress > 100m)
            throw new ArgumentOutOfRangeException(nameof(progress), "Progress must be between 0 and 100.");

        if (actualCost < 0m)
            throw new ArgumentOutOfRangeException(nameof(actualCost), "Actual Cost cannot be negative.");

        var activity =
            (await _activityRepository.GetAllAsync())
            .FirstOrDefault(x => x.Id == activityId);


        if (activity == null)
            throw new Exception("Activity not found");



        var progressDate = date.Date;
        var existingEntries = (await _repository.GetAllAsync())
            .Where(x => x.ActivityId == activityId && !x.IsDeleted)
            .ToList();

        if (existingEntries.Any(x => x.ProgressDate.Date == progressDate))
            throw new InvalidOperationException(
                "A progress entry already exists for this activity and reporting date.");

        var effectiveBaseline = await _baselineService.GetSnapshotForDateAsync(
            activity.ProjectId,
            progressDate);
        var effectiveBaselineActivity = effectiveBaseline?.Activities
            .FirstOrDefault(x => x.ActivityId == activity.Id);

        var effectiveBaselineBudget = effectiveBaselineActivity?.Budget ?? 0m;
        var plannedValue = effectiveBaselineActivity == null
            ? 0m
            : PmsBaselineCalculator.CalculateActivityPlannedValue(
                effectiveBaselineActivity,
                progressDate);

        var entry = new ProgressEntry
        {
            ActivityId = activityId,
            ProgressDate = progressDate,
            Progress = progress,
            ActualCost = actualCost,
            EarnedValue = effectiveBaselineBudget * progress / 100m,
            PlannedValue = plannedValue
        };

        var latestExistingDate = existingEntries.Count == 0
            ? DateTime.MinValue
            : existingEntries.Max(x => x.ProgressDate);

        if (progressDate >= latestExistingDate)
            activity.Progress = progress;

        // Progress-entry ActualCost is a period amount; the Activity field is cumulative.
        activity.ActualCost += actualCost;

        var currentBaseline = await _baselineService.GetActiveSnapshotAsync(activity.ProjectId);
        var currentBaselineBudget = currentBaseline?.Activities
            .FirstOrDefault(x => x.ActivityId == activity.Id)?.Budget ?? 0m;
        activity.EarnedValue = currentBaselineBudget * activity.Progress / 100m;

        _activityRepository.Update(activity);

        await _repository.AddAsync(entry);
        await _repository.SaveChangesAsync();
    }





    public async Task<List<ProgressEntryDto>> GetActivityProgressAsync(
        Guid activityId)
    {
        var items =
            await _repository.GetAllAsync();


        return items
            .Where(x => x.ActivityId == activityId && !x.IsDeleted)
            .OrderBy(x => x.ProgressDate)
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
