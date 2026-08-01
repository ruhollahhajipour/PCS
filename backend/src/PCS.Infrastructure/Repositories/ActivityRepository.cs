using Microsoft.EntityFrameworkCore;
using PCS.Application.PMS.Interfaces;
using PCS.Domain.Entities.PMS;
using PCS.Infrastructure.Persistence;

namespace PCS.Infrastructure.Repositories;

public class ActivityRepository : IActivityRepository
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
        return await _context.Set<Activity>()
            .Include(x => x.Predecessors)
            .Include(x => x.Successors)
            .Include(x => x.WbsNode)
            .Where(x => x.ProjectId == projectId)
            .ToListAsync();
    }



    public async Task<Activity?> GetByIdAsync(
        Guid id)
    {
        return await _context.Set<Activity>()
            .FirstOrDefaultAsync(x => x.Id == id);
    }



    public void Update(
        Activity activity)
    {
        _context.Update(activity);
    }



    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}