using PCS.Application.Common.Events;
using PCS.Application.Projects.Events;

namespace PCS.Application.Projects.EventHandlers;

public sealed class ProjectCreatedNotificationHandler
    : IEventHandler<ProjectCreatedEvent>
{
    public Task HandleAsync(
        ProjectCreatedEvent domainEvent)
    {
        // Notification Service

        return Task.CompletedTask;
    }
}