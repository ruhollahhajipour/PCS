using Microsoft.EntityFrameworkCore;
using PCS.Application.Notifications.Interfaces;
using PCS.Domain.Entities;
using PCS.Infrastructure.Persistence;

namespace PCS.Infrastructure.Notifications;

public sealed class NotificationService
    : INotificationService
{
    private readonly PCSDbContext _context;

    public NotificationService(
        PCSDbContext context)
    {
        _context = context;
    }

    public async Task NotifyAsync(
        Notification notification)
    {
        await _context.Notifications.AddAsync(
            notification);

        await _context.SaveChangesAsync();
    }

    public async Task<List<Notification>>
        GetUserNotificationsAsync(
            Guid userId)
    {
        return await _context.Notifications

            .Where(x => x.UserId == userId)

            .OrderByDescending(x => x.CreatedAt)

            .ToListAsync();
    }

    public async Task MarkAsReadAsync(
        Guid id)
    {
        var notification =
            await _context.Notifications.FindAsync(id);

        if (notification == null)
            return;

        notification.IsRead = true;

        await _context.SaveChangesAsync();
    }
}