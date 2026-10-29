using PCS.Application.Common.Interfaces;
using PCS.Application.Planning.DTOs;
using PCS.Application.Planning.Interfaces;
using PCS.Domain.Entities.Planning;

namespace PCS.Application.Planning.Services;

public class PmsEvmService : IPmsEvmService
{
    private readonly IGenericRepository<Activity> _activityRepository;
    private readonly IGenericRepository<ProgressEntry> _progressRepository;

    public PmsEvmService(
        IGenericRepository<Activity> activityRepository,
        IGenericRepository<ProgressEntry> progressRepository)
    {
        _activityRepository = activityRepository;
        _progressRepository = progressRepository;
    }

    public async Task<EvmResultDto> CalculateAsync(
        Guid projectId,
        DateTime reportDate)
    {
        var activities = (await _activityRepository.GetAllAsync())
            .Where(x => x.ProjectId == projectId)
            .ToList();

        var activityIds = activities.Select(x => x.Id).ToHashSet();

        // ProgressEntry is a dated status snapshot. Use the latest snapshot
        // per activity at or before the report date; summing snapshots
        // would count the same progress and cost repeatedly.
        var latestEntries = (await _progressRepository.GetAllAsync())
            .Where(x => activityIds.Contains(x.ActivityId) &&
                        x.ProgressDate <= reportDate)
            .GroupBy(x => x.ActivityId)
            .Select(group => group
                .OrderByDescending(x => x.ProgressDate)
                .ThenByDescending(x => x.CreatedAt)
                .First())
            .ToList();

        var plannedValue = latestEntries.Sum(x => x.PlannedValue);
        var earnedValue = latestEntries.Sum(x => x.EarnedValue);
        var actualCost = latestEntries.Sum(x => x.ActualCost);

        var costVariance = earnedValue - actualCost;
        var scheduleVariance = earnedValue - plannedValue;
        var cpi = actualCost == 0 ? 0 : earnedValue / actualCost;
        var spi = plannedValue == 0 ? 0 : earnedValue / plannedValue;

        return new EvmResultDto
        {
            ProjectId = projectId,
            ReportDate = reportDate,
            PlannedValue = Math.Round(plannedValue, 2),
            EarnedValue = Math.Round(earnedValue, 2),
            ActualCost = Math.Round(actualCost, 2),
            CostVariance = Math.Round(costVariance, 2),
            ScheduleVariance = Math.Round(scheduleVariance, 2),
            CPI = Math.Round(cpi, 2),
            SPI = Math.Round(spi, 2)
        };
    }
}