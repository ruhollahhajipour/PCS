using PCS.Application.Common.Interfaces;
using PCS.Application.PMS.Interfaces;
using PCS.Domain.Entities.PMS;

namespace PCS.Application.PMS.Services;

public class PmsProgressService : IPmsProgressService
{
    private readonly IGenericRepository<WbsNode> _wbsRepository;
    private readonly IGenericRepository<Activity> _activityRepository;


    public PmsProgressService(
        IGenericRepository<WbsNode> wbsRepository,
        IGenericRepository<Activity> activityRepository)
    {
        _wbsRepository = wbsRepository;
        _activityRepository = activityRepository;
    }


    public async Task<decimal> CalculateWbsProgressAsync(Guid wbsNodeId)
    {
        var activities = await _activityRepository.GetAllAsync();

        var items = activities
            .Where(x => x.WbsNodeId == wbsNodeId)
            .ToList();

        if (!items.Any())
            return 0;

        var totalWeight = items.Sum(x => x.Weight);

        if (totalWeight == 0)
            return 0;

        return Math.Round(
            items.Sum(x => x.Weight * x.Progress) / totalWeight,
            2);
    }


    public async Task<decimal> CalculateProjectProgressAsync(Guid projectId)
    {
        var activities = await _activityRepository.GetAllAsync();

        var items = activities
            .Where(x => x.ProjectId == projectId)
            .ToList();

        if (!items.Any())
            return 0;

        var totalWeight = items.Sum(x => x.Weight);

        if (totalWeight == 0)
            return 0;

        return Math.Round(
            items.Sum(x => x.Weight * x.Progress) / totalWeight,
            2);
    }
}