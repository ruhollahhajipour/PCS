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
    private readonly IPmsBaselineService _baselineService;


    public PmsService(
        IGenericRepository<Project> projectRepository,
        IGenericRepository<Company> companyRepository,
        IGenericRepository<WbsNode> wbsRepository,
        IGenericRepository<Activity> activityRepository,
        IUnitOfWork unitOfWork,
        IWbsCalculationService wbsCalculationService,
        IPmsBaselineService baselineService)
    {
        _projectRepository = projectRepository;
        _companyRepository = companyRepository;
        _wbsRepository = wbsRepository;
        _activityRepository = activityRepository;
        _unitOfWork = unitOfWork;
        _wbsCalculationService = wbsCalculationService;
        _baselineService = baselineService;
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
            .Where(x =>
                x.ProjectId == dto.ProjectId)
            .ToDictionary(
                x => x.Code);




        var wbsMap =
            new Dictionary<string, WbsNode>();





        // =====================================================
        // IMPORT WBS STRUCTURE
        // =====================================================

        foreach(var item in dto.WbsNodes)
        {
            if(string.IsNullOrWhiteSpace(item.Code))
                continue;



            existingWbs.TryGetValue(
                item.Code.Trim(),
                out var currentWbs);



            Guid? parentId = null;


            string path =
                item.Code.Trim();




            if(!string.IsNullOrWhiteSpace(item.ParentCode)
                &&
                wbsMap.TryGetValue(
                    item.ParentCode.Trim(),
                    out var parent))
            {
                parentId =
                    parent.Id;


                path =
                    $"{parent.Path}/{item.Code.Trim()}";
            }




            if(currentWbs != null)
            {
                currentWbs.Name =
                    item.Name.Trim();


                currentWbs.ParentId =
                    parentId;


                currentWbs.Level =
                    item.Level;


                currentWbs.Path =
                    path;



                // Budget WBS بعداً از Activity Rollup می‌شود
                currentWbs.Budget =
                    0;



                currentWbs.Weight =
                    0;



                currentWbs.Progress =
                    0;



                _wbsRepository.Update(
                    currentWbs);



                wbsMap[item.Code.Trim()] =
                    currentWbs;


                continue;
            }





            var wbs =
                new WbsNode
                {
                    Id =
                        Guid.NewGuid(),



                    ProjectId =
                        dto.ProjectId,



                    ParentId =
                        parentId,



                    Code =
                        item.Code.Trim(),



                    Name =
                        item.Name.Trim(),



                    Level =
                        item.Level,



                    SortOrder =
                        0,



                    Path =
                        path,



                    // مقدار واقعی بعداً محاسبه می‌شود
                    Budget =
                        0,



                    Weight =
                        0,



                    Progress =
                        0,



                    IsActive =
                        true
                };




            await _wbsRepository
                .AddAsync(wbs);




            wbsMap[item.Code.Trim()] =
                wbs;
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



                existingActivity.ActualStart =
                    item.ActualStart;



                existingActivity.ActualFinish =
                    item.ActualFinish;



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

                PlannedValue =
                    0m
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

        var activeBaseline =
            await _baselineService.GetActiveSnapshotAsync(projectId);

        var dataDate = DateTime.UtcNow.Date;
        var plannedValueByActivity = activeBaseline == null
            ? new Dictionary<Guid, decimal>()
            : activeBaseline.Activities.ToDictionary(
                x => x.ActivityId,
                x => PmsBaselineCalculator.CalculateActivityPlannedValue(x, dataDate));

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




        var plannedValue =
            activities.Sum(x =>
                plannedValueByActivity.TryGetValue(x.Id, out var value)
                    ? value
                    : 0m);




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



                    var pv =
                        plannedValueByActivity.TryGetValue(x.Id, out var planned)
                            ? planned
                            : 0m;




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
                    totalProjectBudget,
                    plannedValueByActivity),



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
                    2),

            HasApprovedBaseline = activeBaseline != null,
            BaselineId = activeBaseline?.Id,
            BaselineName = activeBaseline?.Name,
            BaselineVersion = activeBaseline?.Version ?? 0,
            EvmDataDate = dataDate
        };
    }







    // =====================================================
    // BUILD WBS TREE
    // =====================================================

    private static List<WbsNodeDto> BuildWbsTree(
        List<WbsNode> nodes,
        List<Activity> activities,
        decimal totalProjectBudget,
        IReadOnlyDictionary<Guid, decimal> plannedValueByActivity)
    {
        if (nodes.Count == 0)
            return new List<WbsNodeDto>();

        var lookup = nodes.ToDictionary(
            x => x.Id,
            x => new WbsNodeDto
            {
                Id = x.Id,
                ParentId = x.ParentId,
                Code = x.Code,
                ParentCode = null,
                Path = x.Path,
                Name = x.Name,
                Level = x.Level,
                SortOrder = x.SortOrder
            });

        // Link the complete hierarchy before calculating any parent totals.
        foreach (var entity in nodes)
        {
            var current = lookup[entity.Id];

            if (entity.ParentId.HasValue &&
                lookup.TryGetValue(entity.ParentId.Value, out var parent))
            {
                current.ParentCode = parent.Code;
                parent.Children.Add(current);
            }
        }

        foreach (var node in lookup.Values)
        {
            node.Children = node.Children
                .OrderBy(x => x.SortOrder)
                .ThenBy(x => x.Code, StringComparer.OrdinalIgnoreCase)
                .ToList();
        }

        var activitiesByWbs = activities
            .Where(x => lookup.ContainsKey(x.WbsNodeId))
            .GroupBy(x => x.WbsNodeId)
            .ToDictionary(x => x.Key, x => x.ToList());

        // Aggregate activity-level values first, then roll them up bottom-up.
        foreach (var entity in nodes)
        {
            if (!activitiesByWbs.TryGetValue(entity.Id, out var assigned))
                continue;

            var dto = lookup[entity.Id];
            dto.Budget = assigned.Sum(x => x.Budget);
            dto.ActualCost = assigned.Sum(x => x.ActualCost);
            dto.EarnedValue = assigned.Sum(x => x.Budget * (x.Progress / 100m));

            dto.PlannedValue = assigned.Sum(x =>
                plannedValueByActivity.TryGetValue(x.Id, out var planned)
                    ? planned
                    : 0m);
        }

        WbsNodeDto RollUp(WbsNodeDto node)
        {
            foreach (var child in node.Children)
            {
                RollUp(child);
                node.Budget += child.Budget;
                node.ActualCost += child.ActualCost;
                node.EarnedValue += child.EarnedValue;
                node.PlannedValue += child.PlannedValue;
            }

            node.Progress = node.Budget == 0
                ? 0
                : Math.Clamp(node.EarnedValue / node.Budget * 100m, 0m, 100m);

            node.WeightValue = totalProjectBudget == 0
                ? 0
                : node.Budget / totalProjectBudget * 100m;

            return node;
        }

        var roots = nodes
            .Where(x => !x.ParentId.HasValue || !lookup.ContainsKey(x.ParentId.Value))
            .OrderBy(x => x.SortOrder)
            .ThenBy(x => x.Code, StringComparer.OrdinalIgnoreCase)
            .Select(x => lookup[x.Id])
            .ToList();

        foreach (var root in roots)
            RollUp(root);

        void SetWeightFactors(IEnumerable<WbsNodeDto> siblings, decimal parentBudget, bool isRoot)
        {
            foreach (var node in siblings)
            {
                node.WeightFactor = isRoot
                    ? 100m
                    : parentBudget == 0
                        ? 0
                        : node.Budget / parentBudget * 100m;

                SetWeightFactors(node.Children, node.Budget, false);
            }
        }

        SetWeightFactors(roots, totalProjectBudget, true);
        return roots;
    }

    // =====================================================
    // GET WBS TREE
    // =====================================================

    public async Task<List<WbsNodeDto>>
        GetWbsTreeAsync(
            Guid projectId)
    {

        var nodes =
            (await _wbsRepository
                .GetAllAsync())
            .Where(x =>
                x.ProjectId == projectId)
            .OrderBy(x =>
                x.Path)
            .ToList();



        var activities =
            (await _activityRepository
                .GetAllAsync())
            .Where(x =>
                x.ProjectId == projectId)
            .ToList();



        var totalBudget =
            activities.Sum(
                x => x.Budget);



        var baseline = await _baselineService.GetActiveSnapshotAsync(projectId);
        var plannedValueByActivity = baseline == null
            ? new Dictionary<Guid, decimal>()
            : baseline.Activities.ToDictionary(
                x => x.ActivityId,
                x => PmsBaselineCalculator.CalculateActivityPlannedValue(x, DateTime.UtcNow.Date));

        return BuildWbsTree(
            nodes,
            activities,
            totalBudget,
            plannedValueByActivity);
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

        var baseline = await _baselineService.GetActiveSnapshotAsync(projectId);
        var plannedValueByActivity = baseline == null
            ? new Dictionary<Guid, decimal>()
            : baseline.Activities.ToDictionary(
                x => x.ActivityId,
                x => PmsBaselineCalculator.CalculateActivityPlannedValue(x, DateTime.UtcNow.Date));

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


                    PlannedValue =
                        plannedValueByActivity.TryGetValue(x.Id, out var planned)
                            ? planned
                            : 0m,


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