using Microsoft.EntityFrameworkCore;
using PCS.Application.PMS.Interfaces;
using PCS.Domain.Entities.PMS;
using PCS.Infrastructure.Persistence;

namespace PCS.Infrastructure.Repositories;

public class ActivityRelationshipRepository
    : IActivityRelationshipRepository
{
    private readonly PCSDbContext _context;

    public ActivityRelationshipRepository(
        PCSDbContext context)
    {
        _context = context;
    }

    public async Task<List<ActivityRelationship>> GetByProjectAsync(
        Guid projectId)
    {
        return await _context.Set<ActivityRelationship>()
            .Include(x => x.Predecessor)
            .Include(x => x.Successor)
            .Where(x => x.Predecessor.ProjectId == projectId)
            .ToListAsync();
    }

    public async Task<List<ActivityRelationship>> GetSuccessorsAsync(
        Guid activityId)
    {
        return await _context.Set<ActivityRelationship>()
            .Where(x => x.PredecessorId == activityId)
            .ToListAsync();
    }

    public async Task<List<ActivityRelationship>> GetPredecessorsAsync(
        Guid activityId)
    {
        return await _context.Set<ActivityRelationship>()
            .Where(x => x.SuccessorId == activityId)
            .ToListAsync();
    }
}