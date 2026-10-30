using PCS.Application.Common.Interfaces;
using PCS.Application.Planning.DTOs;
using PCS.Application.Planning.Interfaces;
using PCS.Domain.Entities.Planning;

namespace PCS.Application.Planning.Services;

public sealed class PmsEvmService : IPmsEvmService
{
    private readonly IGenericRepository<ProgressEntry> _progressRepository;
    private readonly IPmsBaselineService _baselineService;

    public PmsEvmService(
        IGenericRepository<ProgressEntry> progressRepository,
        IPmsBaselineService baselineService)
    {
        _progressRepository = progressRepository;
        _baselineService = baselineService;
    }

    public async Task<EvmResultDto> CalculateAsync(
        Guid projectId,
        DateTime reportDate)
    {
        if (projectId == Guid.Empty)
            throw new ArgumentException("ProjectId is required.", nameof(projectId));

        var dataDate = reportDate.Date;
        var baseline = await _baselineService.GetActiveSnapshotAsync(projectId)
            ?? throw new InvalidOperationException(
                "The project does not have an active approved schedule baseline. Create and approve a baseline before calculating EVM.");

        var baselineActivities = baseline.Activities;
        var activityIds = baselineActivities
            .Select(x => x.ActivityId)
            .ToHashSet();

        var progressEntries = (await _progressRepository.GetAllAsync())
            .Where(x => activityIds.Contains(x.ActivityId) &&
                        x.ProgressDate.Date <= dataDate &&
                        !x.IsDeleted)
            .ToList();

        var latestProgressByActivity = progressEntries
            .GroupBy(x => x.ActivityId)
            .Select(group => group
                .OrderByDescending(x => x.ProgressDate)
                .ThenByDescending(x => x.CreatedAt)
                .First())
            .ToDictionary(x => x.ActivityId);

        decimal earnedValue = 0m;
        // ActualCost on each progress entry is a period cost; accumulate all periods up to the data date.
        decimal actualCost = progressEntries.Sum(x => Math.Max(x.ActualCost, 0m));

        foreach (var baselineActivity in baselineActivities)
        {
            if (!latestProgressByActivity.TryGetValue(
                    baselineActivity.ActivityId,
                    out var progress))
            {
                continue;
            }

            var physicalProgress = Math.Clamp(progress.Progress, 0m, 100m);
            earnedValue += baselineActivity.Budget * physicalProgress / 100m;
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
