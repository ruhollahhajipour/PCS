using PCS.Application.Common.Events;
using PCS.Application.Projects.Events;

namespace PCS.Application.Projects.EventHandlers;

public sealed class ProjectCreatedAuditHandler
    : IEventHandler<ProjectCreatedEvent>
{
    public Task HandleAsync(
        ProjectCreatedEvent domainEvent)
    {
        // Audit Service

        return Task.CompletedTask;
    }
}