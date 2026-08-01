using PCS.Application.Common.Interfaces;
using PCS.Application.PMS.DTOs;
using PCS.Application.PMS.Interfaces;
using PCS.Domain.Entities.PMS;

namespace PCS.Application.PMS.Services;

public class PmsService : IPmsService
{
    private readonly IGenericRepository<WbsNode> _wbsRepository;
    private readonly IGenericRepository<Activity> _activityRepository;

    public PmsService(
        IGenericRepository<WbsNode> wbsRepository,
        IGenericRepository<Activity> activityRepository)
    {
        _wbsRepository = wbsRepository;
        _activityRepository = activityRepository;
    }

    public async Task ImportPmsAsync(ImportPmsDto dto)
    {
        var wbsMap = new Dictionary<string, WbsNode>();

        foreach (var item in dto.WbsNodes)
        {
            Guid? parentId = null;
            string path = item.Code;

            if (!string.IsNullOrWhiteSpace(item.ParentCode) &&
                wbsMap.TryGetValue(item.ParentCode, out var parent))
            {
                parentId = parent.Id;
                path = $"{parent.Path}/{item.Code}";
            }

            var wbs = new WbsNode
            {
                ProjectId = dto.ProjectId,
                ParentId = parentId,
                Code = item.Code,
                Name = item.Name,
                Level = item.Level,
                SortOrder = 0,
                Path = path,
                Budget = item.Budget,
                Weight = item.Weight
            };

            await _wbsRepository.AddAsync(wbs);

            wbsMap[item.Code] = wbs;
        }

        foreach (var item in dto.Activities)
        {
            if (!wbsMap.TryGetValue(item.WbsCode, out var wbs))
                continue;

            var activity = new Activity
            {
                ProjectId = dto.ProjectId,
                WbsNodeId = wbs.Id,
                Code = item.Code,
                Name = item.Name,
                Duration = item.Duration,
                PlannedStart = item.PlannedStart,
                PlannedFinish = item.PlannedFinish,
                Budget = item.Budget,
                Weight = item.Weight,
                Progress = item.Progress,
                IsMilestone = item.IsMilestone
            };

            await _activityRepository.AddAsync(activity);
        }

        await _wbsRepository.SaveChangesAsync();
    }

    public async Task<ExportPmsDto> ExportPmsAsync(Guid projectId)
    {
        var wbsNodes = (await _wbsRepository.GetAllAsync())
            .Where(x => x.ProjectId == projectId)
            .ToList();

        var activities = (await _activityRepository.GetAllAsync())
            .Where(x => x.ProjectId == projectId)
            .ToList();

        var totalBudget = activities.Sum(x => x.Budget);

        var totalWeight = activities.Sum(x => x.Weight);

        var progress = totalWeight == 0
            ? 0
            : activities.Sum(x => x.Weight * x.Progress) / totalWeight;

        return new ExportPmsDto
        {
            ProjectId = projectId,
            ExportDate = DateTime.UtcNow,

            WbsNodes = wbsNodes.Select(x => new WbsNodeDto
{
    Id = x.Id,
    Code = x.Code,
    ParentCode = x.Parent != null ? x.Parent.Code : null,
    Name = x.Name,
    Level = x.Level,
                Budget = x.Budget,
                Weight = x.Weight,
                Progress = 0
            }).ToList(),

            Activities = activities.Select(x => new ActivityDto
            {
                Id = x.Id,
                Code = x.Code,
                WbsCode = wbsNodes.FirstOrDefault(w => w.Id == x.WbsNodeId)?.Code ?? "",
                WbsName = wbsNodes.FirstOrDefault(w => w.Id == x.WbsNodeId)?.Name ?? "",
                Name = x.Name,
                Duration = x.Duration,
                PlannedStart = x.PlannedStart,
                PlannedFinish = x.PlannedFinish,
                Budget = x.Budget,
                Weight = x.Weight,
                Progress = x.Progress,
                ActualCost = 0,
                EarnedValue = x.Budget * x.Progress,
                IsMilestone = x.IsMilestone
            }).ToList(),

            TotalBudget = totalBudget,
            OverallProgress = Math.Round(progress, 2),
            TotalActivities = activities.Count,
            TotalWbsNodes = wbsNodes.Count
        };
    }

    public async Task<List<WbsNodeDto>> GetWbsTreeAsync(Guid projectId)
    {
        var wbsNodes = (await _wbsRepository.GetAllAsync())
            .Where(x => x.ProjectId == projectId)
            .OrderBy(x => x.Path)
            .ToList();

        return wbsNodes.Select(x => new WbsNodeDto
{
    Id = x.Id,
    Code = x.Code,
    ParentCode = null,
    Name = x.Name,
    Level = x.Level,
            Budget = x.Budget,
            Weight = x.Weight,
            Progress = 0
        }).ToList();
    }

    public async Task<List<ActivityDto>> GetActivitiesAsync(Guid projectId)
    {
        var activities = (await _activityRepository.GetAllAsync())
            .Where(x => x.ProjectId == projectId)
            .ToList();

        var wbsNodes = (await _wbsRepository.GetAllAsync())
            .ToDictionary(x => x.Id);

        return activities.Select(x => new ActivityDto
        {
            Id = x.Id,
            Code = x.Code,
            WbsCode = wbsNodes.ContainsKey(x.WbsNodeId) ? wbsNodes[x.WbsNodeId].Code : "",
            WbsName = wbsNodes.ContainsKey(x.WbsNodeId) ? wbsNodes[x.WbsNodeId].Name : "",
            Name = x.Name,
            Duration = x.Duration,
            PlannedStart = x.PlannedStart,
            PlannedFinish = x.PlannedFinish,
            Budget = x.Budget,
            Weight = x.Weight,
            Progress = x.Progress,
            ActualCost = 0,
            EarnedValue = x.Budget * x.Progress,
            IsMilestone = x.IsMilestone
        }).ToList();
    }
}