using Microsoft.EntityFrameworkCore;
using PCS.Application.Planning.Interfaces;
using PCS.Domain.Entities.Planning;
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
        return await _context
            .Set<ActivityRelationship>()

            .Include(x => x.Predecessor)

            .Include(x => x.Successor)

            .Where(x =>
                x.Predecessor.ProjectId == projectId ||
                x.Successor.ProjectId == projectId)

            .ToListAsync();
    }





    public async Task<List<ActivityRelationship>> GetSuccessorsAsync(
        Guid activityId)
    {
        return await _context
            .Set<ActivityRelationship>()

            .Include(x => x.Successor)

            .Where(x =>
                x.PredecessorId == activityId)

            .ToListAsync();
    }





    public async Task<List<ActivityRelationship>> GetPredecessorsAsync(
        Guid activityId)
    {
        return await _context
            .Set<ActivityRelationship>()

            .Include(x => x.Predecessor)

            .Where(x =>
                x.SuccessorId == activityId)

            .ToListAsync();
    }

    public async Task AddRangeAsync(
        IEnumerable<ActivityRelationship> relationships)
    {
        ArgumentNullException.ThrowIfNull(relationships);

        var items = relationships.ToList();
        foreach (var relationship in items)
        {
            ArgumentNullException.ThrowIfNull(relationship);

            // Resolve both endpoints through tenant-filtered queries. This
            // prevents creating a relationship to an activity in another
            // company even when the caller supplies only foreign keys.
            var predecessor = await _context.Activities
                .SingleOrDefaultAsync(x => x.Id == relationship.PredecessorId);
            var successor = await _context.Activities
                .SingleOrDefaultAsync(x => x.Id == relationship.SuccessorId);

            if (predecessor is null || successor is null)
            {
                throw new UnauthorizedAccessException(
                    "Both relationship activities must be accessible in the current tenant.");
            }

            if (predecessor.ProjectId != successor.ProjectId)
            {
                throw new InvalidOperationException(
                    "Activity relationships cannot cross project boundaries.");
            }

            relationship.Predecessor = predecessor;
            relationship.Successor = successor;
        }

        await _context.Set<ActivityRelationship>().AddRangeAsync(items);
    }

    public void DeleteRange(
        IEnumerable<ActivityRelationship> relationships)
    {
        ArgumentNullException.ThrowIfNull(relationships);

        foreach (var relationship in relationships)
        {
            ArgumentNullException.ThrowIfNull(relationship);

            if (_context.Entry(relationship).State == EntityState.Detached)
            {
                throw new InvalidOperationException(
                    "Activity relationships must be loaded through the current DbContext before deletion.");
            }
        }

        _context.Set<ActivityRelationship>().RemoveRange(relationships);
    }
}