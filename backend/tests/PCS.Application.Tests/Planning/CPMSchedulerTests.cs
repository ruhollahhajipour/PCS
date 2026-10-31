using PCS.Application.Planning.Interfaces;
using PCS.Application.Planning.Services;
using PCS.Domain.Entities.Planning;

namespace PCS.Application.Tests.Planning;

public sealed class CPMSchedulerTests
{
    [Fact]
    public async Task TopologicalSort_RejectsRelationshipAcrossProjectBoundaries()
    {
        var projectId = Guid.NewGuid();
        var otherProjectId = Guid.NewGuid();

        var predecessor = new Activity
        {
            Id = Guid.NewGuid(),
            ProjectId = projectId,
            Code = "A-100",
            Duration = 2
        };

        var successor = new Activity
        {
            Id = Guid.NewGuid(),
            ProjectId = otherProjectId,
            Code = "B-100",
            Duration = 3
        };

        var relationship = new ActivityRelationship
        {
            Id = Guid.NewGuid(),
            PredecessorId = predecessor.Id,
            SuccessorId = successor.Id,
            Predecessor = predecessor,
            Successor = successor,
            Type = "FS",
            IsActive = true
        };

        var scheduler = CreateScheduler(
            new[] { predecessor },
            new[] { relationship });

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(
            () => scheduler.TopologicalSortAsync(projectId));

        Assert.Contains("crosses project boundaries", exception.Message);
    }

    [Fact]
    public async Task TopologicalSort_RejectsUnsupportedRelationshipType()
    {
        var projectId = Guid.NewGuid();
        var predecessor = CreateActivity(projectId, "A-100");
        var successor = CreateActivity(projectId, "A-200");

        var relationship = new ActivityRelationship
        {
            Id = Guid.NewGuid(),
            PredecessorId = predecessor.Id,
            SuccessorId = successor.Id,
            Predecessor = predecessor,
            Successor = successor,
            Type = "XX",
            IsActive = true
        };

        var scheduler = CreateScheduler(
            new[] { predecessor, successor },
            new[] { relationship });

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(
            () => scheduler.TopologicalSortAsync(projectId));

        Assert.Contains("unsupported type", exception.Message);
    }

    [Fact]
    public async Task TopologicalSort_RejectsNegativeActivityDuration()
    {
        var projectId = Guid.NewGuid();
        var activity = CreateActivity(projectId, "A-100");
        activity.Duration = -1;

        var scheduler = CreateScheduler(
            new[] { activity },
            Array.Empty<ActivityRelationship>());

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(
            () => scheduler.TopologicalSortAsync(projectId));

        Assert.Contains("negative duration", exception.Message);
    }

    private static Activity CreateActivity(Guid projectId, string code) =>
        new()
        {
            Id = Guid.NewGuid(),
            ProjectId = projectId,
            Code = code,
            Duration = 1
        };

    private static CpmScheduler CreateScheduler(
        IReadOnlyList<Activity> activities,
        IReadOnlyList<ActivityRelationship> relationships) =>
        new(
            new StubActivityRepository(activities),
            new StubActivityRelationshipRepository(relationships));

    private sealed class StubActivityRepository : IActivityRepository
    {
        private readonly List<Activity> _activities;

        public StubActivityRepository(IEnumerable<Activity> activities) =>
            _activities = activities.ToList();

        public Task<List<Activity>> GetProjectActivitiesAsync(Guid projectId) =>
            Task.FromResult(_activities.Where(x => x.ProjectId == projectId).ToList());

        public Task<Activity?> GetByIdAsync(Guid id) =>
            Task.FromResult(_activities.FirstOrDefault(x => x.Id == id));

        public void Update(Activity activity)
        {
        }

        public Task SaveChangesAsync() => Task.CompletedTask;
    }

    private sealed class StubActivityRelationshipRepository
        : IActivityRelationshipRepository
    {
        private readonly List<ActivityRelationship> _relationships;

        public StubActivityRelationshipRepository(
            IEnumerable<ActivityRelationship> relationships) =>
            _relationships = relationships.ToList();

        public Task<List<ActivityRelationship>> GetByProjectAsync(Guid projectId) =>
            Task.FromResult(_relationships);

        public Task<List<ActivityRelationship>> GetSuccessorsAsync(Guid activityId) =>
            Task.FromResult(_relationships
                .Where(x => x.PredecessorId == activityId)
                .ToList());

        public Task<List<ActivityRelationship>> GetPredecessorsAsync(Guid activityId) =>
            Task.FromResult(_relationships
                .Where(x => x.SuccessorId == activityId)
                .ToList());
    }
}
