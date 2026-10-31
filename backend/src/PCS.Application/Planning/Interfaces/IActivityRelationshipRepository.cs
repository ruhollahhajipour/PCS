using PCS.Domain.Entities.Planning;

namespace PCS.Application.Planning.Interfaces;

public interface IActivityRelationshipRepository
{
    Task<List<ActivityRelationship>> GetByProjectAsync(Guid projectId);

    Task<List<ActivityRelationship>> GetSuccessorsAsync(Guid activityId);

    Task<List<ActivityRelationship>> GetPredecessorsAsync(Guid activityId);

    Task AddRangeAsync(IEnumerable<ActivityRelationship> relationships);

    void DeleteRange(IEnumerable<ActivityRelationship> relationships);
}
