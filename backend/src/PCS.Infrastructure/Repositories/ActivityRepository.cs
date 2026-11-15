using Microsoft.EntityFrameworkCore;
using PCS.Application.Planning.Interfaces;
using PCS.Domain.Entities.Planning;
using PCS.Infrastructure.Persistence;

namespace PCS.Infrastructure.Repositories;

public class ActivityRepository
    : IActivityRepository
{
    private readonly PCSDbContext _context;


    public ActivityRepository(
        PCSDbContext context)
    {
        _context = context;
    }



    public async Task<List<Activity>> GetProjectActivitiesAsync(
        Guid projectId)
    {
        return await _context
            .Set<Activity>()

            .Include(x => x.Predecessors)

            .Include(x => x.Successors)

            .Include(x => x.WbsNode)

            .Where(x =>
                x.ProjectId == projectId &&
                !x.IsDeleted)

            .ToListAsync();
    }





    public async Task<Activity?> GetByIdAsync(
        Guid id)
    {
        return await _context
            .Set<Activity>()
            .FirstOrDefaultAsync(
                x => x.Id == id);
    }





    public void Update(
        Activity activity)
    {
        ArgumentNullException.ThrowIfNull(activity);

        var entry = _context.Entry(activity);
        if (entry.State == EntityState.Detached)
        {
            throw new InvalidOperationException(
                "ActivityRepository.Update requires an activity loaded through the current DbContext.");
        }

        if (entry.State == EntityState.Deleted)
        {
            throw new InvalidOperationException("A deleted activity cannot be updated.");
        }

        // Keep EF change tracking scoped to the entity already loaded
        // through the current tenant-filtered DbContext.
    }





    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}