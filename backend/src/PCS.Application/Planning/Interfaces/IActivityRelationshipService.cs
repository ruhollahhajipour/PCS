using PCS.Application.Planning.DTOs;

namespace PCS.Application.Planning.Interfaces;

public interface IActivityRelationshipService
{
    Task ReplacePredecessorsAsync(
        Guid projectId,
        Guid activityId,
        ReplaceActivityRelationshipsDto request);
}
