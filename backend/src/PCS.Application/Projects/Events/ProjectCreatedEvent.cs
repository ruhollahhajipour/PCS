using PCS.Application.Common.Events;

namespace PCS.Application.Projects.Events;

public sealed class ProjectCreatedEvent
    : IDomainEvent
{
    public Guid ProjectId { get; }

    public string ProjectCode { get; }

    public DateTime OccurredOn { get; }
        = DateTime.UtcNow;

    public ProjectCreatedEvent(
        Guid projectId,
        string projectCode)
    {
        ProjectId = projectId;

        ProjectCode = projectCode;
    }
}