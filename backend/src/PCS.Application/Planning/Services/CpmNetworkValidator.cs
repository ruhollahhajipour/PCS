using PCS.Domain.Entities.Planning;

namespace PCS.Application.Planning.Services;

internal static class CpmNetworkValidator
{
    private static readonly HashSet<string> SupportedRelationshipTypes =
        new(StringComparer.OrdinalIgnoreCase)
        {
            "FS",
            "SS",
            "FF",
            "SF"
        };

    public static IReadOnlyList<ActivityRelationship> Validate(
        Guid projectId,
        IReadOnlyCollection<Activity> activities,
        IEnumerable<ActivityRelationship> relationships)
    {
        if (projectId == Guid.Empty)
            throw new ArgumentException("ProjectId is required.", nameof(projectId));

        var activityIds = activities.Select(x => x.Id).ToHashSet();

        foreach (var activity in activities)
        {
            if (activity.Duration < 0)
            {
                throw new InvalidOperationException(
                    $"Activity '{activity.Code}' has a negative duration.");
            }

            if (activity.ProjectId != projectId)
            {
                throw new InvalidOperationException(
                    $"Activity '{activity.Code}' does not belong to project '{projectId}'.");
            }
        }

        var activeRelationships = relationships
            .Where(x => x.IsActive)
            .ToList();

        foreach (var relationship in activeRelationships)
        {
            if (relationship.PredecessorId == Guid.Empty ||
                relationship.SuccessorId == Guid.Empty)
            {
                throw new InvalidOperationException(
                    "An active activity relationship has an empty activity ID.");
            }

            if (relationship.PredecessorId == relationship.SuccessorId)
            {
                throw new InvalidOperationException(
                    "An activity cannot be linked to itself.");
            }

            var type = relationship.Type?.Trim();
            if (string.IsNullOrWhiteSpace(type) ||
                !SupportedRelationshipTypes.Contains(type))
            {
                throw new InvalidOperationException(
                    $"Activity relationship '{relationship.PredecessorId}' → '{relationship.SuccessorId}' has unsupported type '{relationship.Type}'.");
            }

            if (relationship.Predecessor is null ||
                relationship.Successor is null)
            {
                throw new InvalidOperationException(
                    "An active activity relationship references an activity that could not be loaded.");
            }

            if (relationship.Predecessor.ProjectId != projectId ||
                relationship.Successor.ProjectId != projectId)
            {
                throw new InvalidOperationException(
                    $"Activity relationship '{relationship.Predecessor.Code}' → '{relationship.Successor.Code}' crosses project boundaries.");
            }

            if (!activityIds.Contains(relationship.PredecessorId) ||
                !activityIds.Contains(relationship.SuccessorId))
            {
                throw new InvalidOperationException(
                    $"Activity relationship '{relationship.Predecessor.Code}' → '{relationship.Successor.Code}' references an activity that is not schedulable in this project.");
            }
        }

        return activeRelationships;
    }
}
