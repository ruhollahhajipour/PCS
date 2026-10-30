namespace PCS.Application.Planning.DTOs;

public sealed class CreateProjectBaselineDto
{
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }
}

public sealed class ProjectBaselineDto
{
    public Guid Id { get; set; }

    public Guid ProjectId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public int Version { get; set; }

    public DateTime? PlannedStart { get; set; }

    public DateTime? PlannedFinish { get; set; }

    public int PlannedDuration { get; set; }

    public decimal TotalBudget { get; set; }

    public bool IsApproved { get; set; }

    public bool IsActive { get; set; }

    public DateTime? ApprovedAt { get; set; }

    public string? ApprovedBy { get; set; }

    public int ActivityCount { get; set; }
}

public sealed class ProjectBaselineSnapshotDto : ProjectBaselineDto
{
    public IReadOnlyList<ProjectBaselineActivityDto> Activities { get; set; }
        = Array.Empty<ProjectBaselineActivityDto>();
}

public sealed class ProjectBaselineActivityDto
{
    public Guid ActivityId { get; set; }

    public string ActivityCode { get; set; } = string.Empty;

    public string ActivityName { get; set; } = string.Empty;

    public string WbsCode { get; set; } = string.Empty;

    public string WbsName { get; set; } = string.Empty;

    public DateTime? PlannedStart { get; set; }

    public DateTime? PlannedFinish { get; set; }

    public int PlannedDuration { get; set; }

    public decimal Budget { get; set; }

    public int WorkingDaysMask { get; set; }

    public decimal WorkingHoursPerDay { get; set; }

    public bool IsMilestone { get; set; }

    public string CalendarName { get; set; } = string.Empty;
}
