using PCS.Application.Common.Interfaces;
using PCS.Application.Planning.DTOs;
using PCS.Application.Planning.Interfaces;
using PCS.Domain.Entities.Planning;

namespace PCS.Application.Planning.Services;

public sealed class PmsEvmService : IPmsEvmService
{
    private readonly IGenericRepository<ProgressEntry> _progressRepository;
    private readonly IGenericRepository<Activity> _activityRepository;
    private readonly IPmsBaselineService _baselineService;

    public PmsEvmService(
        IGenericRepository<ProgressEntry> progressRepository,
        IGenericRepository<Activity> activityRepository,
        IPmsBaselineService baselineService)
    {
        _progressRepository = progressRepository;
        _activityRepository = activityRepository;
        _baselineService = baselineService;
    }

    public async Task<EvmResultDto> CalculateAsync(
        Guid projectId,
        DateTime reportDate)
    {
        if (projectId == Guid.Empty)
            throw new ArgumentException("ProjectId is required.", nameof(projectId));

        var dataDate = reportDate.Date;
        if (dataDate > DateTime.UtcNow.Date)
            throw new ArgumentOutOfRangeException(
                nameof(reportDate),
                "An EVM data date cannot be in the future.");

        var baseline = await _baselineService.GetSnapshotForDateAsync(projectId, dataDate)
            ?? throw new InvalidOperationException(
                "No approved schedule baseline was effective on the requested EVM data date.");

        var baselineActivities = baseline.Activities;
        var activityIds = baselineActivities
            .Select(x => x.ActivityId)
            .ToList();

        // Chunk IDs to stay below SQL Server's 2,100-parameter limit on large EPC projects.
        var progressEntries = new List<ProgressEntry>();
        var currentActivities = new List<Activity>();
        var progressDateExclusive = dataDate.AddDays(1);

        foreach (var activityIdBatch in activityIds.Chunk(1000))
        {
            var batchIds = activityIdBatch.ToList();
            var batchProgress = await _progressRepository.FindAsync(
                x => batchIds.Contains(x.ActivityId) &&
                     x.ProgressDate < progressDateExclusive &&
                     !x.IsDeleted);
            progressEntries.AddRange(batchProgress);

            var batchActivities = await _activityRepository.FindAsync(
                x => batchIds.Contains(x.Id) && !x.IsDeleted);
            currentActivities.AddRange(batchActivities);
        }

        var latestProgressByActivity = progressEntries
            .GroupBy(x => x.ActivityId)
            .Select(group => group
                .OrderByDescending(x => x.ProgressDate)
                .ThenByDescending(x => x.CreatedAt)
                .First())
            .ToDictionary(x => x.ActivityId);

        var currentActivityById = currentActivities
            .ToDictionary(x => x.Id);

        var progressEntriesByActivity = progressEntries
            .GroupBy(x => x.ActivityId)
            .ToDictionary(x => x.Key, x => x.ToList());

        decimal earnedValue = 0m;
        decimal actualCost = 0m;
        var isCurrentDataDate = dataDate == DateTime.UtcNow.Date;

        foreach (var baselineActivity in baselineActivities)
        {
            var hasCurrentActivity = currentActivityById.TryGetValue(
                baselineActivity.ActivityId,
                out var currentActivity);

            if (isCurrentDataDate && hasCurrentActivity)
            {
                // Current project fields include opening costs that may predate the progress-entry ledger.
                var physicalProgress = Math.Clamp(currentActivity!.Progress, 0m, 100m);
                earnedValue += baselineActivity.Budget * physicalProgress / 100m;

                var currentCost = Math.Max(currentActivity.ActualCost, 0m);
                if (progressEntriesByActivity.TryGetValue(
                        baselineActivity.ActivityId,
                        out var currentActivityEntries))
                {
                    currentCost = Math.Max(
                        currentCost,
                        currentActivityEntries.Sum(x => Math.Max(x.ActualCost, 0m)));
                }

                actualCost += currentCost;
                continue;
            }

            if (latestProgressByActivity.TryGetValue(
                    baselineActivity.ActivityId,
                    out var progress))
            {
                var physicalProgress = Math.Clamp(progress.Progress, 0m, 100m);
                earnedValue += baselineActivity.Budget * physicalProgress / 100m;
            }

            if (progressEntriesByActivity.TryGetValue(
                    baselineActivity.ActivityId,
                    out var activityEntries))
            {
                actualCost += activityEntries.Sum(x => Math.Max(x.ActualCost, 0m));
            }
        }

        var plannedValue = PmsBaselineCalculator.CalculatePlannedValue(
            baselineActivities,
            dataDate);

        var costVariance = earnedValue - actualCost;
        var scheduleVariance = earnedValue - plannedValue;
        var cpi = actualCost <= 0m ? 0m : earnedValue / actualCost;
        var spi = plannedValue <= 0m ? 0m : earnedValue / plannedValue;

        return new EvmResultDto
        {
            ProjectId = projectId,
            ReportDate = dataDate,
            BaselineId = baseline.Id,
            BaselineName = baseline.Name,
            BaselineVersion = baseline.Version,
            BaselineActivityCount = baseline.ActivityCount,
            BaselineBudget = baseline.TotalBudget,
            PlannedValue = Math.Round(plannedValue, 2, MidpointRounding.AwayFromZero),
            EarnedValue = Math.Round(earnedValue, 2, MidpointRounding.AwayFromZero),
            ActualCost = Math.Round(actualCost, 2, MidpointRounding.AwayFromZero),
            CostVariance = Math.Round(costVariance, 2, MidpointRounding.AwayFromZero),
            ScheduleVariance = Math.Round(scheduleVariance, 2, MidpointRounding.AwayFromZero),
            CPI = Math.Round(cpi, 4, MidpointRounding.AwayFromZero),
            SPI = Math.Round(spi, 4, MidpointRounding.AwayFromZero)
        };
    }
}
