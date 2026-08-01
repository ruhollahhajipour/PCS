using PCS.Domain.Entities.PMS;

namespace PCS.Application.PMS.Interfaces;

public interface IActivityRelationshipRepository
{
    Task<List<ActivityRelationship>> GetByProjectAsync(Guid projectId);

    Task<List<ActivityRelationship>> GetSuccessorsAsync(Guid activityId);

    Task<List<ActivityRelationship>> GetPredecessorsAsync(Guid activityId);
}