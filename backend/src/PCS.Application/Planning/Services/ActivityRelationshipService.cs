using PCS.Application.Common.Interfaces;
using PCS.Application.Planning.DTOs;
using PCS.Application.Planning.Interfaces;
using PCS.Domain.Entities.Planning;

namespace PCS.Application.Planning.Services;

public sealed class ActivityRelationshipService : IActivityRelationshipService
{
    private static readonly HashSet<string> SupportedTypes =
        new(StringComparer.OrdinalIgnoreCase)
        {
            "FS",
            "SS",
            "FF",
            "SF"
        };

    private readonly IActivityRepository _activityRepository;
    private readonly IActivityRelationshipRepository _relationshipRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICpmScheduler _scheduler;

    public ActivityRelationshipService(
        IActivityRepository activityRepository,
        IActivityRelationshipRepository relationshipRepository,
        IUnitOfWork unitOfWork,
        ICpmScheduler scheduler)
    {
        _activityRepository = activityRepository;
        _relationshipRepository = relationshipRepository;
        _unitOfWork = unitOfWork;
        _scheduler = scheduler;
    }

    public async Task ReplacePredecessorsAsync(
        Guid projectId,
        Guid activityId,
        ReplaceActivityRelationshipsDto request)
    {
        if (projectId == Guid.Empty)
            throw new ArgumentException("ProjectId is required.", nameof(projectId));

        if (activityId == Guid.Empty)
            throw new ArgumentException("ActivityId is required.", nameof(activityId));

        ArgumentNullException.ThrowIfNull(request);

        var activities = await _activityRepository.GetProjectActivitiesAsync(projectId);
        var activityMap = activities.ToDictionary(x => x.Id);

        if (!activityMap.ContainsKey(activityId))
            throw new KeyNotFoundException($"Activity '{activityId}' was not found in project '{projectId}'.");

        var requested = request.Predecessors ?? new List<ActivityPredecessorDto>();
        if (requested.Any(x => x is null))
            throw new ArgumentException("Predecessor entries cannot be null.");

        if (requested.Any(x => x.PredecessorId == Guid.Empty))
            throw new ArgumentException("Every predecessor must have a valid activity ID.");

        if (requested.Any(x => x.PredecessorId == activityId))
            throw new InvalidOperationException("An activity cannot be linked to itself.");

        if (requested.GroupBy(x => x.PredecessorId).Any(x => x.Count() > 1))
            throw new ArgumentException("A predecessor can only be linked once to an activity.");

        foreach (var predecessor in requested)
        {
            if (!activityMap.ContainsKey(predecessor.PredecessorId))
                throw new ArgumentException(
                    $"Predecessor '{predecessor.PredecessorId}' does not belong to project '{projectId}'.");

            var type = predecessor.Type?.Trim().ToUpperInvariant();
            if (string.IsNullOrWhiteSpace(type) || !SupportedTypes.Contains(type))
                throw new ArgumentException(
                    $"Relationship type '{predecessor.Type}' is not supported.");

            predecessor.Type = type;
        }

        var existing = await _relationshipRepository.GetByProjectAsync(projectId);

        var cycleEdges = existing
            .Where(x =>
                x.IsActive &&
                x.SuccessorId != activityId &&
                activityMap.ContainsKey(x.PredecessorId) &&
                activityMap.ContainsKey(x.SuccessorId))
            .Select(x => (x.PredecessorId, x.SuccessorId))
            .Concat(requested.Select(x => (x.PredecessorId, activityId)))
            .ToList();

        EnsureAcyclic(activityMap.Keys, cycleEdges);

        var replacedIncoming = existing
            .Where(x => x.SuccessorId == activityId)
            .ToList();

        var newRelationships = requested.Select(x => new ActivityRelationship
        {
            Id = Guid.NewGuid(),
            PredecessorId = x.PredecessorId,
            SuccessorId = activityId,
            Type = x.Type,
            Lag = x.Lag,
            IsActive = true
        }).ToList();

        await _unitOfWork.BeginTransactionAsync();
        try
        {
            _relationshipRepository.DeleteRange(replacedIncoming);
            await _relationshipRepository.AddRangeAsync(newRelationships);
            await _unitOfWork.SaveChangesAsync();

            // Recalculate CPM in the same database transaction so invalid
            // networks cannot leave the project with stale schedule data.
            await _scheduler.ScheduleProjectAsync(projectId);

            await _unitOfWork.CommitTransactionAsync();
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    private static void EnsureAcyclic(
        IEnumerable<Guid> activityIds,
        IReadOnlyCollection<(Guid PredecessorId, Guid SuccessorId)> relationships)
    {
        var ids = activityIds.ToHashSet();
        var indegree = ids.ToDictionary(x => x, _ => 0);
        var outgoing = ids.ToDictionary(x => x, _ => new List<Guid>());

        foreach (var relationship in relationships)
        {
            if (!ids.Contains(relationship.PredecessorId) ||
                !ids.Contains(relationship.SuccessorId))
                continue;

            outgoing[relationship.PredecessorId].Add(relationship.SuccessorId);
            indegree[relationship.SuccessorId]++;
        }

        var queue = new Queue<Guid>(
            indegree.Where(x => x.Value == 0).Select(x => x.Key));

        var visited = 0;
        while (queue.Count > 0)
        {
            var current = queue.Dequeue();
            visited++;

            foreach (var successor in outgoing[current])
            {
                indegree[successor]--;
                if (indegree[successor] == 0)
                    queue.Enqueue(successor);
            }
        }

        if (visited != ids.Count)
            throw new InvalidOperationException(
                "The requested relationships would create a circular dependency.");
    }
}
