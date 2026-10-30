using PCS.Application.Common.Interfaces;
using PCS.Application.Planning.DTOs;
using PCS.Application.Planning.Interfaces;
using PCS.Domain.Entities;
using PCS.Domain.Entities.Planning;

namespace PCS.Application.Planning.Services;

public class PmsService : IPmsService
{
    private readonly IGenericRepository<Project> _projectRepository;
    private readonly IGenericRepository<Company> _companyRepository;
    private readonly IGenericRepository<WbsNode> _wbsRepository;
    private readonly IGenericRepository<Activity> _activityRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IWbsCalculationService _wbsCalculationService;


    public PmsService(
        IGenericRepository<Project> projectRepository,
        IGenericRepository<Company> companyRepository,
        IGenericRepository<WbsNode> wbsRepository,
        IGenericRepository<Activity> activityRepository,
        IUnitOfWork unitOfWork,
        IWbsCalculationService wbsCalculationService)
    {
        _projectRepository = projectRepository;
        _companyRepository = companyRepository;
        _wbsRepository = wbsRepository;
        _activityRepository = activityRepository;
        _unitOfWork = unitOfWork;
        _wbsCalculationService = wbsCalculationService;
    }





    // =====================================================
    // IMPORT PMS
    // =====================================================

    public async Task ImportPmsAsync(
        ImportPmsDto dto)
    {
        if(dto.ProjectId == Guid.Empty)
            throw new Exception(
                "ProjectId is required.");



        var project =
            await _projectRepository
                .GetByIdAsync(dto.ProjectId);



        if(project == null)
        {
            throw new Exception(
                $"Project '{dto.ProjectId}' does not exist.");
        }




        var existingWbs =
            (await _wbsRepository.GetAllAsync())
            .Where(x => x.ProjectId == dto.ProjectId)
            .ToDictionary(
                x => x.Code.Trim(),
                StringComparer.OrdinalIgnoreCase);

        var wbsMap = new Dictionary<string, WbsNode>(
            StringComparer.OrdinalIgnoreCase);

        // Pass 1: create/update every WBS node without relying on Excel row order.
        foreach (var item in dto.WbsNodes)
        {
            if (string.IsNullOrWhiteSpace(item.Code))
                continue;

            var code = item.Code.Trim();
            if (wbsMap.ContainsKey(code))
                throw new InvalidOperationException($"Duplicate WBS code '{code}'.");

            existingWbs.TryGetValue(code, out var currentWbs);

            if (currentWbs == null)
            {
                currentWbs = new WbsNode
                {
                    Id = Guid.NewGuid(),
                    ProjectId = dto.ProjectId,
                    Code = code,
                    Name = item.Name.Trim(),
                    Level = item.Level,
                    SortOrder = 0,
                    Path = code,
                    Budget = 0,
                    Weight = 0,
                    Progress = 0,
                    IsActive = true
                };

                await _wbsRepository.AddAsync(currentWbs);
            }
            else
            {
                currentWbs.Name = item.Name.Trim();
                currentWbs.Level = item.Level;
                currentWbs.ParentId = null;
                currentWbs.Path = code;
                currentWbs.Budget = 0;
                currentWbs.Weight = 0;
                currentWbs.Progress = 0;
                _wbsRepository.Update(currentWbs);
            }

            wbsMap.Add(code, currentWbs);
        }

        // Pass 2: resolve parent links after all nodes exist.
        foreach (var item in dto.WbsNodes)
        {
            var code = item.Code.Trim();
            var node = wbsMap[code];

            if (string.IsNullOrWhiteSpace(item.ParentCode))
            {
                node.ParentId = null;
                node.Path = code;
                continue;
            }

            var parentCode = item.ParentCode.Trim();
            if (!wbsMap.TryGetValue(parentCode, out var parent))
                throw new InvalidOperationException(
                    $"WBS '{code}' references unknown parent '{parentCode}'.");

            if (parent.Id == node.Id)
                throw new InvalidOperationException(
                    $"WBS '{code}' cannot be its own parent.");

            node.ParentId = parent.Id;
            _wbsRepository.Update(node);
        }

        // Reject indirect cycles before building paths or saving the import.
        foreach (var node in wbsMap.Values)
        {
            var visited = new HashSet<Guid>();
            var current = node;

            while (current.ParentId.HasValue)
            {
                if (!visited.Add(current.Id))
                    throw new InvalidOperationException(
                        $"WBS hierarchy contains a cycle at '{node.Code}'.");

                current = wbsMap.Values.FirstOrDefault(
                    x => x.Id == current.ParentId.Value)
                    ?? throw new InvalidOperationException(
                        $"WBS '{node.Code}' references a parent outside this project.");
            }

            if (!visited.Add(current.Id))
                throw new InvalidOperationException(
                    $"WBS hierarchy contains a cycle at '{node.Code}'.");
        }

        // Build canonical paths from the resolved hierarchy.
        foreach (var node in wbsMap.Values)
        {
            var segments = new Stack<string>();
            var current = node;
            while (true)
            {
                segments.Push(current.Code);
                if (!current.ParentId.HasValue)
                    break;

                current = wbsMap.Values.First(x => x.Id == current.ParentId.Value);
            }

            node.Path = string.Join("/", segments);
            _wbsRepository.Update(node);
        }

        // =====================================================
        // IMPORT ACTIVITIES
        // =====================================================

        foreach(var item in dto.Activities)
        {
            if(!wbsMap.TryGetValue(
                    item.WbsCode.Trim(),
                    out var wbs))
            {
                throw new Exception(
                    $"Activity '{item.Code}' references WBS '{item.WbsCode}' which does not exist.");
            }




            var existingActivity =
                await _activityRepository
                    .FirstOrDefaultAsync(
                        x =>
                            x.ProjectId == dto.ProjectId &&
                            x.Code == item.Code);





            if(existingActivity != null)
            {
                existingActivity.WbsNodeId =
                    wbs.Id;


                existingActivity.Name =
                    item.Name.Trim();


                existingActivity.Duration =
                    item.Duration;


                existingActivity.RemainingDuration =
                    item.RemainingDuration > 0
                    ? item.RemainingDuration
                    : item.Duration;



                existingActivity.PlannedStart =
                    item.PlannedStart;



                existingActivity.PlannedFinish =
                    item.PlannedFinish;



                if (item.ActualStartSpecified)
                    existingActivity.ActualStart = item.ActualStart;

                if (item.ActualFinishSpecified)
                    existingActivity.ActualFinish = item.ActualFinish;



                existingActivity.Budget =
                    item.Budget;



                existingActivity.Weight =
                    item.Weight;



                existingActivity.Progress =
                    item.Progress;



                existingActivity.EarnedValue =
                    item.Budget *
                    (item.Progress / 100m);



                existingActivity.IsMilestone =
                    item.IsMilestone;



                existingActivity.Status =
                    item.Status;



                _activityRepository.Update(
                    existingActivity);
            }
            else
            {
                var activity =
                    new Activity
                    {
                        Id =
                            Guid.NewGuid(),



                        ProjectId =
                            dto.ProjectId,



                        WbsNodeId =
                            wbs.Id,



                        Code =
                            item.Code.Trim(),



                        Name =
                            item.Name.Trim(),



                        Duration =
                            item.Duration,



                        RemainingDuration =
                            item.RemainingDuration > 0
                            ? item.RemainingDuration
                            : item.Duration,



                        PlannedStart =
                            item.PlannedStart,



                        PlannedFinish =
                            item.PlannedFinish,



                        ActualStart =
                            item.ActualStart,



                        ActualFinish =
                            item.ActualFinish,



                        Budget =
                            item.Budget,



                        Weight =
                            item.Weight,



                        Progress =
                            item.Progress,



                        EarnedValue =
                            item.Budget *
                            (item.Progress / 100m),



                        ActualCost =
                            0,



                        Status =
                            item.Status,



                        IsMilestone =
                            item.IsMilestone
                    };



                await _activityRepository
                    .AddAsync(activity);
            }
        }





        await _unitOfWork
    .SaveChangesAsync();




// =====================================================
// WBS CALCULATION
// =====================================================

var wbsDtos =
    wbsMap.Values
        .Select(x =>
            new WbsNodeDto
            {
                Id =
                    x.Id,

                ParentId =
                    x.ParentId,

                Code =
                    x.Code,

                ParentCode =
                    null,

                Name =
                    x.Name,

                Level =
                    x.Level,

                Budget =
                    0
            })
        .ToList();




var activityDtos =
    dto.Activities
        .Select(x =>
            new ActivityDto
            {
                Id =
                Guid.Empty,

                Code =
                    x.Code,

                Name =
                    x.Name,

                WbsCode =
                    x.WbsCode,

                Budget =
                    x.Budget,

                ActualCost =
                    0,

                Progress =
                    x.Progress,

                EarnedValue =
                    x.Budget *
                    (x.Progress / 100m),

                PlannedValue = 0
            })
        .ToList();





var calculatedWbs =
    _wbsCalculationService.Calculate(
        wbsDtos,
        activityDtos);





foreach(var item in calculatedWbs)
{
    if(!wbsMap.TryGetValue(
            item.Code,
            out var entity))
    {
        continue;
    }



    entity.Budget =
        item.Budget;



    entity.ActualCost =
        item.ActualCost;



    entity.EarnedValue =
        item.EarnedValue;



    entity.PlannedValue =
        item.PlannedValue;



    entity.WeightFactor =
        item.WeightFactor;



    entity.WeightValue =
        item.WeightValue;



    entity.Progress =
        item.Progress;



    _wbsRepository.Update(entity);
}





await _unitOfWork
    .SaveChangesAsync();

        }
        
        // =====================================================
    // EXPORT PMS
    // =====================================================

    public async Task<ExportPmsDto> ExportPmsAsync(
        Guid projectId)
    {
        var project =
            await _projectRepository
                .GetByIdAsync(projectId);



        if(project == null)
        {
            throw new Exception(
                $"Project '{projectId}' not found.");
        }




        var company =
            await _companyRepository
                .GetByIdAsync(
                    project.CompanyId);





        var wbsNodes =
            (await _wbsRepository.GetAllAsync())
            .Where(x =>
                x.ProjectId == projectId)
            .OrderBy(x =>
                x.Path)
            .ToList();





        var activities =
            (await _activityRepository.GetAllAsync())
            .Where(x =>
                x.ProjectId == projectId)
            .ToList();






        // =====================================================
        // PROJECT KPI FROM ACTIVITIES
        // =====================================================

        var totalProjectBudget =
            activities.Sum(
                x => x.Budget);




        var actualCost =
            activities.Sum(
                x => x.ActualCost);




        var earnedValue =
            activities.Sum(
                x =>
                    x.Budget *
                    (x.Progress / 100m));




        // Activity-level time-phased baseline values are not modeled.
        // Do not fabricate PV from a fixed percentage of budget.
        var plannedValue = 0m;




        var overallProgress =
            totalProjectBudget == 0
            ? 0
            :
            (earnedValue /
             totalProjectBudget)
             * 100m;




        var cpi =
            actualCost == 0
            ? 0
            :
            earnedValue /
            actualCost;




        var spi =
            plannedValue == 0
            ? 0
            :
            earnedValue /
            plannedValue;






        // =====================================================
        // BUILD ACTIVITY DTO
        // =====================================================

        var activityDtos =
            activities.Select(
                x =>
                {
                    var wbs =
                        wbsNodes
                        .FirstOrDefault(
                            n =>
                                n.Id ==
                                x.WbsNodeId);



                    var weightValue =
                        totalProjectBudget == 0
                        ? 0
                        :
                        (x.Budget /
                         totalProjectBudget)
                         * 100m;



                    var earned =
                        x.Budget *
                        (x.Progress / 100m);



                    var pv = 0m; // Activity-level baseline PV is not modeled yet.




                    return new ActivityDto
                    {
                        Id =
                            x.Id,



                        Code =
                            x.Code,



                        Name =
                            x.Name,



                        WbsCode =
                            wbs?.Code
                            ??
                            string.Empty,



                        WbsName =
                            wbs?.Name,



                        WbsLevel =
                            wbs?.Level
                            ?? 0,



                        Duration =
                            x.Duration,



                        RemainingDuration =
                            x.RemainingDuration,



                        PlannedStart =
                            x.PlannedStart,



                        PlannedFinish =
                            x.PlannedFinish,



                        ActualStart =
                            x.ActualStart,



                        ActualFinish =
                            x.ActualFinish,



                        Progress =
                            x.Progress,



                        // W.V
                        WeightValue =
                            weightValue,



                        // برای Activity مستقل،
                        // W.F در Export برابر نسبت به WBS است
                        WeightFactor =
                            wbs == null ||
                            wbs.Budget == 0
                            ? 0
                            :
                            (x.Budget /
                             wbs.Budget)
                             * 100m,



                        Weight =
                            weightValue,



                        WeightedProgress =
                            weightValue *
                            (x.Progress / 100m),



                        Budget =
                            x.Budget,



                        ActualCost =
                            x.ActualCost,



                        EarnedValue =
                            earned,



                        PlannedValue =
                            pv,



                        CostVariance =
                            earned -
                            x.ActualCost,



                        ScheduleVariance =
                            earned -
                            pv,



                        CPI =
                            x.ActualCost == 0
                            ? 0
                            :
                            earned /
                            x.ActualCost,



                        SPI =
                            pv == 0
                            ? 0
                            :
                            earned /
                            pv,



                        EarlyStart =
                            x.EarlyStart,


                        EarlyFinish =
                            x.EarlyFinish,


                        LateStart =
                            x.LateStart,


                        LateFinish =
                            x.LateFinish,


                        TotalFloat =
                            x.TotalFloat,


                        FreeFloat =
                            x.FreeFloat,


                        DrivingFloat =
                            x.DrivingFloat,


                        IsCritical =
                            x.IsCritical,



                        Status =
                            x.Status,



                        IsMilestone =
                            x.IsMilestone
                    };
                })
                .ToList();
                        return new ExportPmsDto
        {
            ProjectId =
                projectId,


            ProjectName =
                project.Name,


            ExportDate =
                DateTime.UtcNow,


            CompanyDisplayName =
                company?.Name
                ??
                string.Empty,


            CompanyLogoPath =
                company?.Theme?.LogoPath
                ??
                string.Empty,


            ThemePrimaryColor =
                company?.Theme?.PrimaryColor
                ??
                "#2563EB",


            ThemeDarkColor =
                company?.Theme?.DarkColor
                ??
                "#0F172A",


            ThemeSecondaryColor =
                company?.Theme?.SecondaryColor
                ??
                "#60A5FA",


            ThemeBorderColor =
                company?.Theme?.BorderColor
                ??
                "#1E3A8A",



            WbsNodes =
                BuildWbsTree(
                    wbsNodes,
                    activities,
                    totalProjectBudget),



            Activities =
                activityDtos,



            TotalBudget =
                totalProjectBudget,


            OverallProgress =
                Math.Round(
                    overallProgress,
                    2),


            TotalActivities =
                activities.Count,


            TotalWbsNodes =
                wbsNodes.Count,


            PlannedValue =
                plannedValue,


            EarnedValue =
                earnedValue,


            ActualCost =
                actualCost,


            CostVariance =
                earnedValue -
                actualCost,


            ScheduleVariance =
                earnedValue -
                plannedValue,


            CPI =
                Math.Round(
                    cpi,
                    2),


            SPI =
                Math.Round(
                    spi,
                    2)
        };
    }







    // =====================================================
    // BUILD WBS TREE
    // =====================================================

    private static List<WbsNodeDto> BuildWbsTree(
        List<WbsNode> nodes,
        List<Activity> activities,
        decimal totalProjectBudget)
    {
        var lookup = nodes.ToDictionary(
            node => node.Id,
            node => new WbsNodeDto
            {
                Id = node.Id,
                ParentId = node.ParentId,
                Code = node.Code,
                ParentCode = nodes.FirstOrDefault(parent => parent.Id == node.ParentId)?.Code,
                Path = node.Path,
                Name = node.Name,
                Level = node.Level,
                SortOrder = node.SortOrder
            });

        // Aggregate direct activity values first. PlannedValue is intentionally
        // zero: the current Activity entity has no baseline/time-phased PV field.
        foreach (var activity in activities)
        {
            if (!lookup.TryGetValue(activity.WbsNodeId, out var node))
                continue;

            node.Budget += activity.Budget;
            node.ActualCost += activity.ActualCost;
            node.EarnedValue += activity.Budget * (activity.Progress / 100m);
        }

        // Roll up each node once, from leaves to roots.
        foreach (var node in nodes.OrderByDescending(item => item.Level))
        {
            if (!node.ParentId.HasValue ||
                !lookup.TryGetValue(node.ParentId.Value, out var parent))
                continue;

            var child = lookup[node.Id];
            parent.Budget += child.Budget;
            parent.ActualCost += child.ActualCost;
            parent.EarnedValue += child.EarnedValue;
            parent.PlannedValue += child.PlannedValue;
        }

        foreach (var item in lookup.Values)
        {
            item.WeightValue = totalProjectBudget <= 0
                ? 0
                : item.Budget / totalProjectBudget * 100m;

            item.WeightFactor = item.ParentId.HasValue &&
                lookup.TryGetValue(item.ParentId.Value, out var parent) &&
                parent.Budget > 0
                    ? item.Budget / parent.Budget * 100m
                    : item.ParentId.HasValue ? 0 : (item.Budget > 0 ? 100m : 0m);

            item.Progress = item.Budget <= 0
                ? 0
                : item.EarnedValue / item.Budget * 100m;
        }

        var roots = new List<WbsNodeDto>();
        foreach (var node in nodes.OrderBy(item => item.SortOrder).ThenBy(item => item.Code))
        {
            var item = lookup[node.Id];
            if (node.ParentId.HasValue && lookup.TryGetValue(node.ParentId.Value, out var parent))
                parent.Children.Add(item);
            else
                roots.Add(item);
        }

        return roots;
    }


    // =====================================================
    // GET WBS TREE
    // =====================================================

    public async Task<List<WbsNodeDto>> GetWbsTreeAsync(Guid projectId)
    {
        var nodes = (await _wbsRepository.GetAllAsync())
            .Where(item => item.ProjectId == projectId)
            .OrderBy(item => item.Level)
            .ThenBy(item => item.SortOrder)
            .ThenBy(item => item.Code)
            .ToList();

        var activities = (await _activityRepository.GetAllAsync())
            .Where(item => item.ProjectId == projectId)
            .ToList();

        var totalBudget = activities.Sum(item => item.Budget);
        return BuildWbsTree(nodes, activities, totalBudget);
    }


    // =====================================================
    // GET ACTIVITIES
    // =====================================================

    public async Task<List<ActivityDto>>
        GetActivitiesAsync(
            Guid projectId)
    {

        var activities =
            (await _activityRepository
                .GetAllAsync())
            .Where(x =>
                x.ProjectId == projectId)
            .ToList();



        var wbs =
            (await _wbsRepository
                .GetAllAsync())
            .ToDictionary(
                x => x.Id);



        var totalBudget =
            activities.Sum(
                x => x.Budget);



        return activities.Select(
            x =>
            {

                wbs.TryGetValue(
                    x.WbsNodeId,
                    out var node);



                return new ActivityDto
                {
                    Id =
                        x.Id,


                    Code =
                        x.Code,


                    Name =
                        x.Name,


                    WbsCode =
                        node?.Code
                        ??
                        string.Empty,


                    WbsName =
                        node?.Name,


                    WbsLevel =
                        node?.Level
                        ?? 0,


                    Budget =
                        x.Budget,


                    ActualCost =
                        x.ActualCost,


                    Progress =
                        x.Progress,


                    WeightValue =
                        totalBudget == 0
                        ? 0
                        :
                        (x.Budget /
                         totalBudget)
                         * 100m,


                    EarnedValue =
                        x.Budget *
                        (x.Progress / 100m),


                    PlannedValue = 0,


                    IsCritical =
                        x.IsCritical,


                    Status =
                        x.Status,


                    IsMilestone =
                        x.IsMilestone
                };

            })
            .ToList();
    }
}