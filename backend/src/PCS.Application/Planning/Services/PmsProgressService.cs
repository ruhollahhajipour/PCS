using PCS.Application.Common.Interfaces;
using PCS.Application.Planning.Interfaces;
using PCS.Domain.Entities.Planning;

namespace PCS.Application.Planning.Services;

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
        var items = (await _activityRepository.FindAsync(
            x => x.WbsNodeId == wbsNodeId && !x.IsDeleted))
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
        var items = (await _activityRepository.FindAsync(
            x => x.ProjectId == projectId && !x.IsDeleted))
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
