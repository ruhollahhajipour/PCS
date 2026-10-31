using PCS.Application.Common.Interfaces;
using PCS.Application.Planning.DTOs;
using PCS.Application.Planning.Interfaces;
using PCS.Application.Planning.Services;
using PCS.Domain.Entities.Planning;

namespace PCS.Application.Tests.Planning;

public sealed class ActivityRelationshipServiceTests
{
    [Fact]
    public async Task ReplacePredecessors_RejectsCircularDependency()
    {
        var projectId = Guid.NewGuid();
        var first = CreateActivity(projectId, "A-100");
        var second = CreateActivity(projectId, "A-200");
        var third = CreateActivity(projectId, "A-300");

        var relationships = new List<ActivityRelationship>
        {
            CreateRelationship(first, second),
            CreateRelationship(second, third)
        };

        var service = CreateService(new[] { first, second, third }, relationships);

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(
            () => service.ReplacePredecessorsAsync(
                projectId,
                first.Id,
                new ReplaceActivityRelationshipsDto
                {
                    Predecessors = new()
                    {
                        new ActivityPredecessorDto
                        {
                            PredecessorId = third.Id,
                            Type = "FS"
                        }
                    }
                }));

        Assert.Contains("circular dependency", exception.Message);
    }

    [Fact]
    public async Task ReplacePredecessors_RejectsPredecessorFromAnotherProject()
    {
        var projectId = Guid.NewGuid();
        var target = CreateActivity(projectId, "A-200");
        var external = CreateActivity(Guid.NewGuid(), "X-100");
        var service = CreateService(new[] { target }, Array.Empty<ActivityRelationship>());

        var exception = await Assert.ThrowsAsync<ArgumentException>(
            () => service.ReplacePredecessorsAsync(
                projectId,
                target.Id,
                new ReplaceActivityRelationshipsDto
                {
                    Predecessors = new()
                    {
                        new ActivityPredecessorDto
                        {
                            PredecessorId = external.Id,
                            Type = "FS"
                        }
                    }
                }));

        Assert.Contains("does not belong to project", exception.Message);
    }

    [Fact]
    public async Task ReplacePredecessors_ReplacesIncomingLinksAndRecalculatesSchedule()
    {
        var projectId = Guid.NewGuid();
        var predecessor = CreateActivity(projectId, "A-100");
        var target = CreateActivity(projectId, "A-200");
        var oldPredecessor = CreateActivity(projectId, "A-050");
        var oldLink = CreateRelationship(oldPredecessor, target);
        var repository = new StubRelationshipRepository(new[] { oldLink });
        var scheduler = new StubScheduler();
        var unitOfWork = new StubUnitOfWork();

        var service = new ActivityRelationshipService(
            new StubActivityRepository(new[] { predecessor, target, oldPredecessor }),
            repository,
            unitOfWork,
            scheduler);

        await service.ReplacePredecessorsAsync(
            projectId,
            target.Id,
            new ReplaceActivityRelationshipsDto
            {
                Predecessors = new()
                {
                    new ActivityPredecessorDto
                    {
                        PredecessorId = predecessor.Id,
                        Type = "SS",
                        Lag = 2
                    }
                }
            });

        Assert.DoesNotContain(repository.Relationships, x => x.Id == oldLink.Id);
        var saved = Assert.Single(repository.Relationships);
        Assert.Equal(predecessor.Id, saved.PredecessorId);
        Assert.Equal(target.Id, saved.SuccessorId);
        Assert.Equal("SS", saved.Type);
        Assert.Equal(2, saved.Lag);
        Assert.True(scheduler.WasCalled);
        Assert.True(unitOfWork.WasCommitted);
    }

    private static Activity CreateActivity(Guid projectId, string code) =>
        new()
        {
            Id = Guid.NewGuid(),
            ProjectId = projectId,
            Code = code,
            Duration = 2
        };

    private static ActivityRelationship CreateRelationship(
        Activity predecessor,
        Activity successor) =>
        new()
        {
            Id = Guid.NewGuid(),
            PredecessorId = predecessor.Id,
            SuccessorId = successor.Id,
            Predecessor = predecessor,
            Successor = successor,
            Type = "FS",
            IsActive = true
        };

    private static ActivityRelationshipService CreateService(
        IReadOnlyList<Activity> activities,
        IEnumerable<ActivityRelationship> relationships) =>
        new(
            new StubActivityRepository(activities),
            new StubRelationshipRepository(relationships),
            new StubUnitOfWork(),
            new StubScheduler());

    private sealed class StubActivityRepository : IActivityRepository
    {
        private readonly List<Activity> _activities;

        public StubActivityRepository(IEnumerable<Activity> activities) =>
            _activities = activities.ToList();

        public Task<List<Activity>> GetProjectActivitiesAsync(Guid projectId) =>
            Task.FromResult(_activities.Where(x => x.ProjectId == projectId).ToList());

        public Task<Activity?> GetByIdAsync(Guid id) =>
            Task.FromResult(_activities.FirstOrDefault(x => x.Id == id));

        public void Update(Activity activity) { }

        public Task SaveChangesAsync() => Task.CompletedTask;
    }

    private sealed class StubRelationshipRepository : IActivityRelationshipRepository
    {
        public List<ActivityRelationship> Relationships { get; }

        public StubRelationshipRepository(IEnumerable<ActivityRelationship> relationships) =>
            Relationships = relationships.ToList();

        public Task<List<ActivityRelationship>> GetByProjectAsync(Guid projectId) =>
            Task.FromResult(Relationships);

        public Task<List<ActivityRelationship>> GetSuccessorsAsync(Guid activityId) =>
            Task.FromResult(Relationships.Where(x => x.PredecessorId == activityId).ToList());

        public Task<List<ActivityRelationship>> GetPredecessorsAsync(Guid activityId) =>
            Task.FromResult(Relationships.Where(x => x.SuccessorId == activityId).ToList());

        public Task AddRangeAsync(IEnumerable<ActivityRelationship> relationships)
        {
            Relationships.AddRange(relationships);
            return Task.CompletedTask;
        }

        public void DeleteRange(IEnumerable<ActivityRelationship> relationships)
        {
            var ids = relationships.Select(x => x.Id).ToHashSet();
            Relationships.RemoveAll(x => ids.Contains(x.Id));
        }
    }

    private sealed class StubUnitOfWork : IUnitOfWork
    {
        public bool WasCommitted { get; private set; }

        public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default) =>
            Task.FromResult(1);

        public Task BeginTransactionAsync() => Task.CompletedTask;

        public Task CommitTransactionAsync()
        {
            WasCommitted = true;
            return Task.CompletedTask;
        }

        public Task RollbackTransactionAsync() => Task.CompletedTask;
    }

    private sealed class StubScheduler : ICpmScheduler
    {
        public bool WasCalled { get; private set; }

        public Task<CpmResultDto> ScheduleProjectAsync(Guid projectId)
        {
            WasCalled = true;
            return Task.FromResult(new CpmResultDto());
        }

        public Task<List<Activity>> TopologicalSortAsync(Guid projectId) =>
            Task.FromResult(new List<Activity>());

        public Task ForwardPassAsync(Guid projectId) => Task.CompletedTask;
        public Task BackwardPassAsync(Guid projectId) => Task.CompletedTask;
        public Task CalculateFloatAsync(Guid projectId) => Task.CompletedTask;
        public Task DetectCriticalPathAsync(Guid projectId) => Task.CompletedTask;
    }
}
