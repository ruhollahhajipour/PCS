using PCS.Application.Common.Interfaces;
using PCS.Application.Planning.DTOs;
using PCS.Application.Planning.Interfaces;
using PCS.Domain.Entities;
using PCS.Domain.Entities.Planning;

namespace PCS.Application.Planning.Services;

public class PmsDashboardService : IPmsDashboardService
{
    private readonly IGenericRepository<Project> _projectRepository;
    private readonly IGenericRepository<Activity> _activityRepository;
    private readonly IPmsEvmService _evmService;
    private readonly IPmsBaselineService _baselineService;


    public PmsDashboardService(
        IGenericRepository<Project> projectRepository,
        IGenericRepository<Activity> activityRepository,
        IPmsEvmService evmService,
        IPmsBaselineService baselineService)
    {
        _projectRepository = projectRepository;
        _activityRepository = activityRepository;
        _evmService = evmService;
        _baselineService = baselineService;
    }



    public async Task<PmsDashboardDto> GetProjectDashboardAsync(
        Guid projectId)
    {
        var projects =
            await _projectRepository.GetAllAsync();


        var project =
            projects.FirstOrDefault(x => x.Id == projectId);



        if (project == null)
            throw new Exception("Project not found");



        var activities =
            await _activityRepository.GetAllAsync();



        var projectActivities =
            activities
            .Where(x => x.ProjectId == projectId)
            .ToList();



        var activeBaseline =
            await _baselineService.GetActiveSnapshotAsync(projectId);

        var baselineBudgetByActivity = activeBaseline?.Activities
            .ToDictionary(x => x.ActivityId, x => x.Budget)
            ?? new Dictionary<Guid, decimal>();

        var projectBudget = activeBaseline?.TotalBudget
            ?? projectActivities.Sum(x => x.Budget);

        var physicalProgressValue = projectActivities.Sum(activity =>
        {
            var activityBudget = activeBaseline is null
                ? activity.Budget
                : baselineBudgetByActivity.GetValueOrDefault(activity.Id);

            return activityBudget * Math.Clamp(activity.Progress, 0m, 100m) / 100m;
        });

        var progress = projectBudget <= 0m
            ? 0m
            : Math.Round(
                physicalProgressValue / projectBudget * 100m,
                2,
                MidpointRounding.AwayFromZero);

        var evm = activeBaseline == null
            ? null
            : await _evmService.CalculateAsync(
                projectId,
                DateTime.UtcNow);

        return new PmsDashboardDto
        {
            ProjectId = projectId,

            ProjectName = project.Name,

            Progress = progress,

            Budget = projectBudget,

            ActualCost =
                evm?.ActualCost ?? projectActivities.Sum(x => x.ActualCost),

            EarnedValue =
                evm?.EarnedValue ?? 0m,

            CPI =
                evm?.CPI ?? 0m,

            SPI =
                evm?.SPI ?? 0m,

            TotalActivities =
                projectActivities.Count,

            CompletedActivities =
                projectActivities.Count(
                    x => x.Progress >= 100)
        };
    }
}
