using PCS.Domain.Entities;

namespace PCS.Application.Notifications.Interfaces;

public interface INotificationService
{
    Task NotifyAsync(
        Notification notification);

    Task<List<Notification>> GetUserNotificationsAsync(
        Guid userId);

    Task MarkAsReadAsync(
        Guid id);
}