using PCS.Application.Common.Interfaces;
using PCS.Application.PMS.DTOs;
using PCS.Application.PMS.Interfaces;
using PCS.Domain.Entities;
using PCS.Domain.Entities.PMS;

namespace PCS.Application.PMS.Services;

public class PmsDashboardService : IPmsDashboardService
{
    private readonly IGenericRepository<Project> _projectRepository;
    private readonly IGenericRepository<Activity> _activityRepository;
    private readonly IPmsProgressService _progressService;
    private readonly IPmsEvmService _evmService;


    public PmsDashboardService(
        IGenericRepository<Project> projectRepository,
        IGenericRepository<Activity> activityRepository,
        IPmsProgressService progressService,
        IPmsEvmService evmService)
    {
        _projectRepository = projectRepository;
        _activityRepository = activityRepository;
        _progressService = progressService;
        _evmService = evmService;
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



        var progress =
            await _progressService
            .CalculateProjectProgressAsync(projectId);



        var evm =
            await _evmService.CalculateAsync(
                projectId,
                DateTime.Now);



        return new PmsDashboardDto
        {
            ProjectId = projectId,

            ProjectName = project.Name,

            Progress = progress,

            Budget =
                projectActivities.Sum(x => x.Budget),

            ActualCost =
                evm.ActualCost,

            EarnedValue =
                evm.EarnedValue,

            CPI =
                evm.CPI,

            SPI =
                evm.SPI,

            TotalActivities =
                projectActivities.Count,

            CompletedActivities =
                projectActivities.Count(
                    x => x.Progress >= 100)
        };
    }
}