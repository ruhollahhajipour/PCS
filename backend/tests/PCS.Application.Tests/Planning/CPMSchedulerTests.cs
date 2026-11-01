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

    [Fact]
    public async Task ScheduleProjectAsync_CalculatesMixedRelationshipsAndWorkingOffsets()
    {
        var projectId = Guid.NewGuid();
        var a = CreateActivity(projectId, "A");
        var b = CreateActivity(projectId, "B");
        var c = CreateActivity(projectId, "C");
        a.Duration = 2;
        b.Duration = 3;
        c.Duration = 1;

        var relationships = new[]
        {
            CreateRelationship(a, b, "FS", lag: 1),
            CreateRelationship(b, c, "FF")
        };

        var scheduler = CreateScheduler(
            new[] { a, b, c },
            relationships);

        var result = await scheduler.ScheduleProjectAsync(projectId);

        Assert.Equal(6, result.ProjectDuration);
        Assert.Equal(3, result.CriticalActivitiesCount);
        Assert.Equal(new[] { 0, 3, 5 }, new[]
        {
            a.EarlyStart,
            b.EarlyStart,
            c.EarlyStart
        });
        Assert.Equal(new[] { 2, 6, 6 }, new[]
        {
            a.EarlyFinish,
            b.EarlyFinish,
            c.EarlyFinish
        });
        Assert.Equal(new[] { 0, 0, 0 }, new[]
        {
            a.TotalFloat,
            b.TotalFloat,
            c.TotalFloat
        });
        Assert.Equal(new[] { 0, 0 }, new[]
        {
            a.FreeFloat,
            b.FreeFloat
        });
        Assert.All(new[] { a, b, c }, activity => Assert.True(activity.IsCritical));
    }

    [Fact]
    public async Task ScheduleProjectAsync_MarksBothParallelCriticalBranches()
    {
        var projectId = Guid.NewGuid();
        var a = CreateActivity(projectId, "A");
        var b = CreateActivity(projectId, "B");
        var c = CreateActivity(projectId, "C");
        var d = CreateActivity(projectId, "D");

        foreach (var activity in new[] { a, b, c, d })
            activity.Duration = 2;

        var relationships = new[]
        {
            CreateRelationship(a, b, "FS"),
            CreateRelationship(c, d, "FS")
        };

        var scheduler = CreateScheduler(
            new[] { a, b, c, d },
            relationships);

        var result = await scheduler.ScheduleProjectAsync(projectId);

        Assert.Equal(4, result.ProjectDuration);
        Assert.Equal(4, result.CriticalActivitiesCount);
        Assert.Equal(
            new[] { "A", "B", "C", "D" },
            result.CriticalPath.OrderBy(code => code, StringComparer.Ordinal));
        Assert.All(
            new[] { a, b, c, d },
            activity => Assert.Equal(0, activity.TotalFloat));
    }

    [Theory]
    [InlineData("SS")]
    [InlineData("SF")]
    public async Task ScheduleProjectAsync_BoundsLateFinishByProjectCompletionForOverlappingRelationships(
        string relationshipType)
    {
        var projectId = Guid.NewGuid();
        var predecessor = CreateActivity(projectId, "A-LONG");
        var successor = CreateActivity(projectId, "B-SHORT");
        predecessor.Duration = 10;
        successor.Duration = 2;

        var scheduler = CreateScheduler(
            new[] { predecessor, successor },
            new[] { CreateRelationship(predecessor, successor, relationshipType) });

        var result = await scheduler.ScheduleProjectAsync(projectId);

        Assert.Equal(10, result.ProjectDuration);
        Assert.Equal(10, predecessor.LateFinish);
        Assert.Equal(0, predecessor.TotalFloat);
        Assert.Equal(8, successor.TotalFloat);
        Assert.True(predecessor.IsCritical);
        Assert.False(successor.IsCritical);
    }

    private static ActivityRelationship CreateRelationship(
        Activity predecessor,
        Activity successor,
        string type,
        int lag = 0) =>
        new()
        {
            Id = Guid.NewGuid(),
            PredecessorId = predecessor.Id,
            SuccessorId = successor.Id,
            Predecessor = predecessor,
            Successor = successor,
            Type = type,
            Lag = lag,
            IsActive = true
        };

    [Fact]
    public async Task ScheduleProjectAsync_HandlesTenThousandActivityDeepNetwork()
    {
        const int activityCount = 10_000;
        var projectId = Guid.NewGuid();
        var activities = Enumerable.Range(0, activityCount)
            .Select(index =>
            {
                var activity = CreateActivity(projectId, $"A-{index:D5}");
                activity.Duration = 1;
                return activity;
            })
            .ToList();

        var relationships = Enumerable.Range(1, activityCount - 1)
            .Select(index => CreateRelationship(
                activities[index - 1],
                activities[index],
                "FS"))
            .ToList();

        var scheduler = CreateScheduler(activities, relationships);

        var result = await scheduler.ScheduleProjectAsync(projectId);

        Assert.Equal(activityCount, result.TotalActivities);
        Assert.Equal(activityCount, result.ProjectDuration);
        Assert.Equal(activityCount, result.CriticalActivitiesCount);
        Assert.Equal(0, activities[0].EarlyStart);
        Assert.Equal(activityCount, activities[^1].EarlyFinish);
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

        public Task AddRangeAsync(IEnumerable<ActivityRelationship> relationships)
        {
            _relationships.AddRange(relationships);
            return Task.CompletedTask;
        }

        public void DeleteRange(IEnumerable<ActivityRelationship> relationships)
        {
            var ids = relationships.Select(x => x.Id).ToHashSet();
            _relationships.RemoveAll(x => ids.Contains(x.Id));
        }
    }
}
