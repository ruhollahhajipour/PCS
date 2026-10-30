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
        var financials = BuildFinancialSnapshot(
            activities,
            activeBaseline,
            dataDate);

        var totalProjectBudget = financials.TotalBudget;
        var actualCost = financials.ActualCost;
        var earnedValue = financials.EarnedValue;
        var plannedValue = financials.PlannedValue;




        var overallProgress = financials.OverallProgress;




        var cpi = financials.CPI;




        var spi = financials.SPI;






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



                    var activityBudget = financials.BudgetByActivity[x.Id];
                    var activityActualCost = financials.ActualCostByActivity[x.Id];
                    var weightValue = totalProjectBudget == 0
                        ? 0
                        : activityBudget / totalProjectBudget * 100m;



                    var earned = financials.EarnedValueByActivity[x.Id];
                    var pv = financials.PlannedValueByActivity[x.Id];
                    var costVariance = activeBaseline == null
                        ? 0m
                        : earned - activityActualCost;
                    var scheduleVariance = activeBaseline == null
                        ? 0m
                        : earned - pv;




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
                            (activityBudget /
                             wbs.Budget)
                             * 100m,



                        Weight =
                            weightValue,



                        WeightedProgress =
                            weightValue *
                            (x.Progress / 100m),



                        Budget =
                            activityBudget,



                        ActualCost =
                            activityActualCost,



                        EarnedValue =
                            earned,



                        PlannedValue =
                            pv,



                        CostVariance =
                            costVariance,



                        ScheduleVariance =
                            scheduleVariance,



                        CPI =
                            activeBaseline == null || activityActualCost == 0
                            ? 0
                            :
                            earned /
                            activityActualCost,



                        SPI =
                            activeBaseline == null || pv == 0
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
                    financials),



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


            CostVariance = activeBaseline == null
                ? 0m
                : earnedValue - actualCost,


            ScheduleVariance = activeBaseline == null
                ? 0m
                : earnedValue - plannedValue,


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
        PmsFinancialSnapshot financials)
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

        var physicalProgressValueByWbs = nodes.ToDictionary(
            x => x.Id,
            _ => 0m);

        // Aggregate activity-level values first, then roll them up bottom-up.
        foreach (var entity in nodes)
        {
            if (!activitiesByWbs.TryGetValue(entity.Id, out var assigned))
                continue;

            var dto = lookup[entity.Id];
            dto.Budget = assigned.Sum(x => financials.BudgetByActivity[x.Id]);
            dto.ActualCost = assigned.Sum(x => financials.ActualCostByActivity[x.Id]);
            dto.EarnedValue = assigned.Sum(x => financials.EarnedValueByActivity[x.Id]);
            dto.PlannedValue = assigned.Sum(x => financials.PlannedValueByActivity[x.Id]);
            physicalProgressValueByWbs[entity.Id] = assigned.Sum(
                x => financials.ProgressValueByActivity[x.Id]);
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
                physicalProgressValueByWbs[node.Id] += physicalProgressValueByWbs[child.Id];
            }

            node.Progress = node.Budget == 0
                ? 0
                : Math.Clamp(
                    physicalProgressValueByWbs[node.Id] / node.Budget * 100m,
                    0m,
                    100m);

            node.WeightValue = financials.TotalBudget == 0
                ? 0
                : node.Budget / financials.TotalBudget * 100m;

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

        SetWeightFactors(roots, financials.TotalBudget, true);
        return roots;
    }

    private sealed record PmsFinancialSnapshot(
        decimal TotalBudget,
        decimal PlannedValue,
        decimal EarnedValue,
        decimal ActualCost,
        decimal OverallProgress,
        decimal CPI,
        decimal SPI,
        Dictionary<Guid, decimal> BudgetByActivity,
        Dictionary<Guid, decimal> ActualCostByActivity,
        Dictionary<Guid, decimal> EarnedValueByActivity,
        Dictionary<Guid, decimal> PlannedValueByActivity,
        Dictionary<Guid, decimal> ProgressValueByActivity);

    private static PmsFinancialSnapshot BuildFinancialSnapshot(
        IReadOnlyCollection<Activity> activities,
        ProjectBaselineSnapshotDto? baseline,
        DateTime dataDate)
    {
        var baselineByActivity = baseline?.Activities
            .ToDictionary(x => x.ActivityId)
            ?? new Dictionary<Guid, ProjectBaselineActivityDto>();

        var budgetByActivity = activities.ToDictionary(
            x => x.Id,
            x => baseline == null
                ? x.Budget
                : baselineByActivity.TryGetValue(x.Id, out var item)
                    ? item.Budget
                    : 0m);

        var actualCostByActivity = activities.ToDictionary(
            x => x.Id,
            x => baseline == null || baselineByActivity.ContainsKey(x.Id)
                ? x.ActualCost
                : 0m);

        var progressValueByActivity = activities.ToDictionary(
            x => x.Id,
            x => budgetByActivity[x.Id] * Math.Clamp(x.Progress, 0m, 100m) / 100m);

        var earnedValueByActivity = activities.ToDictionary(
            x => x.Id,
            x => baseline == null ? 0m : progressValueByActivity[x.Id]);

        var plannedValueByActivity = activities.ToDictionary(
            x => x.Id,
            x => baselineByActivity.TryGetValue(x.Id, out var item)
                ? PmsBaselineCalculator.CalculateActivityPlannedValue(item, dataDate)
                : 0m);

        var totalBudget = baseline?.TotalBudget ?? budgetByActivity.Values.Sum();
        var plannedValue = baseline == null
            ? 0m
            : baseline.Activities.Sum(x =>
                PmsBaselineCalculator.CalculateActivityPlannedValue(x, dataDate));
        var earnedValue = earnedValueByActivity.Values.Sum();
        var actualCost = actualCostByActivity.Values.Sum();
        var physicalProgressValue = progressValueByActivity.Values.Sum();

        return new PmsFinancialSnapshot(
            totalBudget,
            plannedValue,
            earnedValue,
            actualCost,
            totalBudget == 0m ? 0m : physicalProgressValue / totalBudget * 100m,
            baseline == null || actualCost == 0m ? 0m : earnedValue / actualCost,
            baseline == null || plannedValue == 0m ? 0m : earnedValue / plannedValue,
            budgetByActivity,
            actualCostByActivity,
            earnedValueByActivity,
            plannedValueByActivity,
            progressValueByActivity);
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



        var baseline = await _baselineService.GetActiveSnapshotAsync(projectId);
        var financials = BuildFinancialSnapshot(
            activities,
            baseline,
            DateTime.UtcNow.Date);

        return BuildWbsTree(
            nodes,
            activities,
            financials);
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



        var baseline = await _baselineService.GetActiveSnapshotAsync(projectId);
        var financials = BuildFinancialSnapshot(
            activities,
            baseline,
            DateTime.UtcNow.Date);

        var totalBudget = financials.TotalBudget;

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
                        financials.BudgetByActivity[x.Id],


                    ActualCost =
                        financials.ActualCostByActivity[x.Id],


                    Progress =
                        x.Progress,


                    WeightValue =
                        totalBudget == 0
                        ? 0
                        :
                        (financials.BudgetByActivity[x.Id] /
                         totalBudget)
                         * 100m,


                    EarnedValue =
                        financials.EarnedValueByActivity[x.Id],


                    PlannedValue =
                        financials.PlannedValueByActivity[x.Id],


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