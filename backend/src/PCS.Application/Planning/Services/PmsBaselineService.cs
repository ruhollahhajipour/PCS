using PCS.Application.Common.Interfaces;
using PCS.Application.Planning.DTOs;
using PCS.Application.Planning.Interfaces;
using PCS.Domain.Entities;
using PCS.Domain.Entities.Planning;

namespace PCS.Application.Planning.Services;

public sealed class PmsBaselineService : IPmsBaselineService
{
    private const int DefaultWorkingDaysMask =
        (1 << (int)DayOfWeek.Monday) |
        (1 << (int)DayOfWeek.Tuesday) |
        (1 << (int)DayOfWeek.Wednesday) |
        (1 << (int)DayOfWeek.Thursday) |
        (1 << (int)DayOfWeek.Friday);

    private readonly IGenericRepository<Project> _projectRepository;
    private readonly IGenericRepository<Activity> _activityRepository;
    private readonly IGenericRepository<WbsNode> _wbsRepository;
    private readonly IGenericRepository<ProjectCalendar> _calendarRepository;
    private readonly IGenericRepository<ProjectBaseline> _baselineRepository;
    private readonly IGenericRepository<ProjectBaselineActivity> _baselineActivityRepository;
    private readonly IUnitOfWork _unitOfWork;

    public PmsBaselineService(
        IGenericRepository<Project> projectRepository,
        IGenericRepository<Activity> activityRepository,
        IGenericRepository<WbsNode> wbsRepository,
        IGenericRepository<ProjectCalendar> calendarRepository,
        IGenericRepository<ProjectBaseline> baselineRepository,
        IGenericRepository<ProjectBaselineActivity> baselineActivityRepository,
        IUnitOfWork unitOfWork)
    {
        _projectRepository = projectRepository;
        _activityRepository = activityRepository;
        _wbsRepository = wbsRepository;
        _calendarRepository = calendarRepository;
        _baselineRepository = baselineRepository;
        _baselineActivityRepository = baselineActivityRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<ProjectBaselineSnapshotDto> CreateDraftAsync(
        Guid projectId,
        CreateProjectBaselineDto request,
        string? createdBy)
    {
        if (projectId == Guid.Empty)
            throw new ArgumentException("ProjectId is required.", nameof(projectId));

        var name = request.Name?.Trim();
        if (string.IsNullOrWhiteSpace(name) || name.Length > 200)
            throw new ArgumentException("Baseline name is required and must not exceed 200 characters.", nameof(request));

        if (request.Description is { Length: > 500 })
            throw new ArgumentException("Baseline description must not exceed 500 characters.", nameof(request));

        var project = await _projectRepository.GetByIdAsync(projectId)
            ?? throw new KeyNotFoundException($"Project '{projectId}' was not found.");

        if (project.IsDeleted)
            throw new KeyNotFoundException($"Project '{projectId}' was not found.");

        // Include soft-deleted versions because the database's project/name
        // uniqueness constraint also includes them; version numbers stay monotonic.
        var existingBaselines = (await _baselineRepository.FindAsync(
            x => x.ProjectId == projectId)).ToList();

        if (existingBaselines.Any(x => string.Equals(x.Name, name, StringComparison.OrdinalIgnoreCase)))
            throw new InvalidOperationException($"A baseline named '{name}' already exists in this project.");

        var activities = (await _activityRepository.FindAsync(
            x => x.ProjectId == projectId && !x.IsDeleted)).ToList();

        if (activities.Count == 0)
            throw new InvalidOperationException("A baseline cannot be created because the project has no activities.");

        if (activities.Any(x => x.Budget < 0))
            throw new InvalidOperationException("Activity budgets cannot be negative.");

        var wbsNodes = (await _wbsRepository.FindAsync(
            x => x.ProjectId == projectId && !x.IsDeleted))
            .ToDictionary(x => x.Id);

        var calendars = (await _calendarRepository.FindAsync(
            x => x.ProjectId == projectId && x.IsActive && !x.IsDeleted))
            .ToList();

        var defaultCalendar = calendars.FirstOrDefault(x => x.IsDefault);
        var snapshotItems = new List<ProjectBaselineActivity>(activities.Count);

        foreach (var activity in activities)
        {
            if (activity.Budget > 0 &&
                (!activity.PlannedStart.HasValue || !activity.PlannedFinish.HasValue))
            {
                throw new InvalidOperationException(
                    $"Activity '{activity.Code}' has a budget but does not have both planned dates.");
            }

            if (activity.PlannedStart.HasValue &&
                activity.PlannedFinish.HasValue &&
                activity.PlannedFinish.Value.Date < activity.PlannedStart.Value.Date)
            {
                throw new InvalidOperationException(
                    $"Activity '{activity.Code}' has a planned finish earlier than its planned start.");
            }

            if (!wbsNodes.TryGetValue(activity.WbsNodeId, out var wbs))
                throw new InvalidOperationException(
                    $"Activity '{activity.Code}' references a WBS node that is not part of this project.");

            ProjectCalendar? calendar;
            if (activity.CalendarId.HasValue)
            {
                calendar = calendars.FirstOrDefault(x => x.Id == activity.CalendarId.Value);
                if (calendar is null)
                {
                    throw new InvalidOperationException(
                        $"Activity '{activity.Code}' references a calendar that is not active in this project.");
                }
            }
            else
            {
                calendar = defaultCalendar;
            }

            var workingDaysMask = calendar is null
                ? DefaultWorkingDaysMask
                : BuildWorkingDaysMask(calendar);

            var isMilestone = activity.IsMilestone;
            if (activity.Budget > 0 && !isMilestone &&
                activity.PlannedStart.HasValue &&
                activity.PlannedFinish.HasValue &&
                CountWorkingDays(
                    activity.PlannedStart.Value.Date,
                    activity.PlannedFinish.Value.Date,
                    workingDaysMask) == 0)
            {
                throw new InvalidOperationException(
                    $"Activity '{activity.Code}' has no working days in its planned date range. Check its project calendar.");
            }

            snapshotItems.Add(new ProjectBaselineActivity
            {
                Id = Guid.NewGuid(),
                ProjectBaselineId = Guid.Empty,
                ActivityId = activity.Id,
                ActivityCode = activity.Code,
                ActivityName = activity.Name,
                WbsCode = wbs.Code,
                WbsName = wbs.Name,
                PlannedStart = activity.PlannedStart,
                PlannedFinish = activity.PlannedFinish,
                PlannedDuration = activity.Duration > 0
                    ? activity.Duration
                    : activity.PlannedStart.HasValue && activity.PlannedFinish.HasValue
                        ? CountWorkingDays(
                            activity.PlannedStart.Value.Date,
                            activity.PlannedFinish.Value.Date,
                            workingDaysMask)
                        : 0,
                Budget = activity.Budget,
                WorkingDaysMask = workingDaysMask,
                WorkingHoursPerDay = calendar is { WorkingHoursPerDay: > 0m }
                    ? calendar.WorkingHoursPerDay
                    : 8m,
                IsMilestone = isMilestone,
                CalendarName = calendar?.Name ?? "Default (Monday-Friday)",
                CreatedBy = createdBy
            });
        }

        var plannedStarts = snapshotItems
            .Where(x => x.PlannedStart.HasValue)
            .Select(x => x.PlannedStart!.Value.Date)
            .ToList();
        var plannedFinishes = snapshotItems
            .Where(x => x.PlannedFinish.HasValue)
            .Select(x => x.PlannedFinish!.Value.Date)
            .ToList();

        var baseline = new ProjectBaseline
        {
            Id = Guid.NewGuid(),
            ProjectId = project.Id,
            Name = name,
            Description = request.Description?.Trim(),
            Version = existingBaselines.Count == 0 ? 1 : existingBaselines.Max(x => x.Version) + 1,
            PlannedStart = plannedStarts.Count == 0 ? null : plannedStarts.Min(),
            PlannedFinish = plannedFinishes.Count == 0 ? null : plannedFinishes.Max(),
            PlannedDuration = plannedStarts.Count == 0 || plannedFinishes.Count == 0
                ? 0
                : (plannedFinishes.Max() - plannedStarts.Min()).Days + 1,
            TotalBudget = snapshotItems.Sum(x => x.Budget),
            PlannedValue = 0m,
            IsApproved = false,
            IsActive = false,
            CreatedBy = createdBy
        };

        foreach (var item in snapshotItems)
            item.ProjectBaselineId = baseline.Id;

        await _baselineRepository.AddAsync(baseline);
        await _baselineActivityRepository.AddRangeAsync(snapshotItems);
        await _baselineRepository.SaveChangesAsync();

        return ToSnapshotDto(baseline, snapshotItems);
    }

    public async Task<ProjectBaselineDto> ApproveAsync(
        Guid projectId,
        Guid baselineId,
        string? approvedBy)
    {
        await _unitOfWork.BeginTransactionAsync();

        try
        {
            var baseline = await _baselineRepository.GetByIdAsync(baselineId)
                ?? throw new KeyNotFoundException($"Baseline '{baselineId}' was not found.");

            if (baseline.ProjectId != projectId || baseline.IsDeleted)
                throw new KeyNotFoundException($"Baseline '{baselineId}' was not found in this project.");

            if (baseline.IsApproved)
                throw new InvalidOperationException(
                    "An approved baseline is immutable. Create a new draft version to re-baseline the project.");

            var snapshotItems = (await _baselineActivityRepository.FindAsync(
                x => x.ProjectBaselineId == baselineId && !x.IsDeleted))
                .ToList();

            if (snapshotItems.Count == 0)
                throw new InvalidOperationException("An empty baseline cannot be approved.");

            var baselines = (await _baselineRepository.FindAsync(
                x => x.ProjectId == projectId && !x.IsDeleted))
                .ToList();

            // Deactivate the previous version first so the filtered unique index
            // remains valid regardless of EF's SQL update ordering.
            foreach (var current in baselines.Where(
                         x => x.IsActive && x.IsApproved && x.Id != baselineId))
            {
                current.IsActive = false;
                current.UpdatedAt = DateTime.UtcNow;
                current.UpdatedBy = approvedBy;
                _baselineRepository.Update(current);
            }

            await _unitOfWork.SaveChangesAsync();

            baseline.IsApproved = true;
            baseline.IsActive = true;
            baseline.ApprovedAt = DateTime.UtcNow;
            baseline.ApprovedBy = approvedBy;
            baseline.UpdatedAt = DateTime.UtcNow;
            baseline.UpdatedBy = approvedBy;
            _baselineRepository.Update(baseline);

            await _unitOfWork.SaveChangesAsync();
            await _unitOfWork.CommitTransactionAsync();

            return ToDto(baseline, snapshotItems.Count);
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

        public async Task<IReadOnlyList<ProjectBaselineDto>> GetAllAsync(Guid projectId)
    {
        var baselines = (await _baselineRepository.FindAsync(
                x => x.ProjectId == projectId && !x.IsDeleted))
            .OrderByDescending(x => x.Version)
            .ToList();

        var baselineIds = baselines.Select(x => x.Id).ToList();
        var items = baselineIds.Count == 0
            ? new List<ProjectBaselineActivity>()
            : (await _baselineActivityRepository.FindAsync(
                x => baselineIds.Contains(x.ProjectBaselineId) && !x.IsDeleted)).ToList();

        return baselines
            .Select(x => ToDto(x, items.Count(a => a.ProjectBaselineId == x.Id)))
            .ToList();
    }

    public async Task<ProjectBaselineSnapshotDto?> GetActiveSnapshotAsync(Guid projectId)
    {
        var activeBaselines = (await _baselineRepository.FindAsync(
            x => x.ProjectId == projectId &&
                 x.IsApproved &&
                 x.IsActive &&
                 !x.IsDeleted)).ToList();

        if (activeBaselines.Count == 0)
            return null;

        if (activeBaselines.Count > 1)
            throw new InvalidOperationException(
                $"Project '{projectId}' has more than one active approved baseline. Data correction is required.");

        var baseline = activeBaselines[0];
        var items = (await _baselineActivityRepository.FindAsync(
            x => x.ProjectBaselineId == baseline.Id && !x.IsDeleted))
            .ToList();

        return ToSnapshotDto(baseline, items);
    }

    public async Task<ProjectBaselineSnapshotDto?> GetSnapshotForDateAsync(
        Guid projectId,
        DateTime dataDate)
    {
        var effectiveDateExclusive = dataDate.Date.AddDays(1);
        var effectiveBaseline = (await _baselineRepository.FindAsync(
                x => x.ProjectId == projectId &&
                     x.IsApproved &&
                     x.ApprovedAt.HasValue &&
                     x.ApprovedAt.Value < effectiveDateExclusive &&
                     !x.IsDeleted))
            .OrderByDescending(x => x.ApprovedAt)
            .ThenByDescending(x => x.Version)
            .FirstOrDefault();

        if (effectiveBaseline == null)
            return null;

        var items = (await _baselineActivityRepository.FindAsync(
            x => x.ProjectBaselineId == effectiveBaseline.Id && !x.IsDeleted))
            .ToList();

        if (items.Count == 0)
            throw new InvalidOperationException(
                $"Approved baseline '{effectiveBaseline.Name}' has no activity snapshots.");

        return ToSnapshotDto(effectiveBaseline, items);
    }

    private static ProjectBaselineDto ToDto(ProjectBaseline baseline, int activityCount) => new()
    {
        Id = baseline.Id,
        ProjectId = baseline.ProjectId,
        Name = baseline.Name,
        Description = baseline.Description,
        Version = baseline.Version,
        PlannedStart = baseline.PlannedStart,
        PlannedFinish = baseline.PlannedFinish,
        PlannedDuration = baseline.PlannedDuration,
        TotalBudget = baseline.TotalBudget,
        IsApproved = baseline.IsApproved,
        IsActive = baseline.IsActive,
        ApprovedAt = baseline.ApprovedAt,
        ApprovedBy = baseline.ApprovedBy,
        ActivityCount = activityCount
    };

    private static ProjectBaselineSnapshotDto ToSnapshotDto(
        ProjectBaseline baseline,
        IReadOnlyCollection<ProjectBaselineActivity> activities) => new()
    {
        Id = baseline.Id,
        ProjectId = baseline.ProjectId,
        Name = baseline.Name,
        Description = baseline.Description,
        Version = baseline.Version,
        PlannedStart = baseline.PlannedStart,
        PlannedFinish = baseline.PlannedFinish,
        PlannedDuration = baseline.PlannedDuration,
        TotalBudget = baseline.TotalBudget,
        IsApproved = baseline.IsApproved,
        IsActive = baseline.IsActive,
        ApprovedAt = baseline.ApprovedAt,
        ApprovedBy = baseline.ApprovedBy,
        ActivityCount = activities.Count,
        Activities = activities.Select(x => new ProjectBaselineActivityDto
        {
            ActivityId = x.ActivityId,
            ActivityCode = x.ActivityCode,
            ActivityName = x.ActivityName,
            WbsCode = x.WbsCode,
            WbsName = x.WbsName,
            PlannedStart = x.PlannedStart,
            PlannedFinish = x.PlannedFinish,
            PlannedDuration = x.PlannedDuration,
            Budget = x.Budget,
            WorkingDaysMask = x.WorkingDaysMask,
            WorkingHoursPerDay = x.WorkingHoursPerDay,
            IsMilestone = x.IsMilestone,
            CalendarName = x.CalendarName
        }).ToList()
    };

    private static int BuildWorkingDaysMask(ProjectCalendar calendar)
    {
        var mask = 0;
        if (calendar.SundayWorking) mask |= 1 << (int)DayOfWeek.Sunday;
        if (calendar.MondayWorking) mask |= 1 << (int)DayOfWeek.Monday;
        if (calendar.TuesdayWorking) mask |= 1 << (int)DayOfWeek.Tuesday;
        if (calendar.WednesdayWorking) mask |= 1 << (int)DayOfWeek.Wednesday;
        if (calendar.ThursdayWorking) mask |= 1 << (int)DayOfWeek.Thursday;
        if (calendar.FridayWorking) mask |= 1 << (int)DayOfWeek.Friday;
        if (calendar.SaturdayWorking) mask |= 1 << (int)DayOfWeek.Saturday;
        return mask;
    }

    private static int CountWorkingDays(DateTime start, DateTime finish, int workingDaysMask)
    {
        var count = 0;
        for (var date = start.Date; date <= finish.Date; date = date.AddDays(1))
        {
            if ((workingDaysMask & (1 << (int)date.DayOfWeek)) != 0)
                count++;
        }

        return count;
    }
}
