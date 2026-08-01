using PCS.Application.Common.Interfaces;
using PCS.Application.PMS.DTOs;
using PCS.Application.PMS.Interfaces;
using PCS.Domain.Entities.PMS;

namespace PCS.Application.PMS.Services;

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
        var activities =
            await _activityRepository.GetAllAsync();


        var projectActivities =
            activities
            .Where(x => x.ProjectId == projectId)
            .ToList();



        var progressEntries =
            await _progressRepository.GetAllAsync();



        var entries =
            progressEntries
            .Where(x =>
                projectActivities
                .Select(a => a.Id)
                .Contains(x.ActivityId)
                &&
                x.ProgressDate <= reportDate)
            .ToList();



        decimal plannedValue =
            projectActivities
            .Where(x =>
                x.PlannedStart <= reportDate)
            .Sum(x => x.Budget);



        decimal earnedValue =
            entries.Sum(x => x.EarnedValue);



        decimal actualCost =
            entries.Sum(x => x.ActualCost);



        decimal costVariance =
            earnedValue - actualCost;


        decimal scheduleVariance =
            earnedValue - plannedValue;



        decimal cpi =
            actualCost == 0
            ? 0
            : earnedValue / actualCost;



        decimal spi =
            plannedValue == 0
            ? 0
            : earnedValue / plannedValue;



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