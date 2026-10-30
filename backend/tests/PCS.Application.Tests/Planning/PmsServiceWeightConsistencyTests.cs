using System.Linq.Expressions;
using PCS.Application.Common.Interfaces;
using PCS.Application.Planning.DTOs;
using PCS.Application.Planning.Interfaces;
using PCS.Application.Planning.Services;
using PCS.Domain.Entities;
using PCS.Domain.Entities.Planning;

namespace PCS.Application.Tests.Planning;

public sealed class PmsServiceWeightConsistencyTests
{
    [Fact]
    public async Task GetActivitiesAsync_UsesCalculatedWbsBudgetForActivityWeights()
    {
        var fixture = CreateFixture();
        var service = fixture.CreateService();

        var activities = await service.GetActivitiesAsync(fixture.Project.Id);

        var childActivity = Assert.Single(activities.Where(x => x.Code == "A-CHILD"));
        var rootActivity = Assert.Single(activities.Where(x => x.Code == "A-ROOT"));

        Assert.Equal(25m, childActivity.WeightFactor);
        Assert.Equal(20m, childActivity.WeightValue);
        Assert.Equal(10m, childActivity.WeightedProgress);
        Assert.Equal(12m, childActivity.Weight);

        Assert.Equal(20m, rootActivity.WeightFactor);
        Assert.Equal(20m, rootActivity.WeightValue);
        Assert.Equal(20m, rootActivity.WeightedProgress);
    }

    [Fact]
    public async Task ExportPmsAsync_UsesSameCalculatedWeightsAsActivityApi()
    {
        var fixture = CreateFixture();
        var service = fixture.CreateService();

        var export = await service.ExportPmsAsync(fixture.Project.Id);

        var childActivity = Assert.Single(export.Activities.Where(x => x.Code == "A-CHILD"));
        var childWbs = Assert.Single(Flatten(export.WbsNodes).Where(x => x.Code == "01.01"));

        Assert.Equal(400m, childWbs.Budget);
        Assert.Equal(25m, childActivity.WeightFactor);
        Assert.Equal(20m, childActivity.WeightValue);
        Assert.Equal(10m, childActivity.WeightedProgress);
    }

    [Fact]
    public async Task ExportPmsAsync_UsesProgressLedgerActualCostForCurrentEvmSnapshot()
    {
        var fixture = CreateFixture();
        var activity = fixture.Activities.Single(x => x.Code == "A-CHILD");
        var baseline = new ProjectBaselineSnapshotDto
        {
            Id = Guid.NewGuid(),
            ProjectId = fixture.Project.Id,
            Name = "Approved Baseline",
            Version = 1,
            TotalBudget = 500m,
            IsApproved = true,
            IsActive = true,
            Activities = fixture.Activities.Select(x => new ProjectBaselineActivityDto
            {
                ActivityId = x.Id,
                ActivityCode = x.Code,
                Budget = x.Budget
            }).ToList()
        };
        var progressEntries = new[]
        {
            new ProgressEntry
            {
                ActivityId = activity.Id,
                ProgressDate = DateTime.UtcNow.Date,
                ActualCost = 75m
            },
            new ProgressEntry
            {
                ActivityId = activity.Id,
                ProgressDate = DateTime.UtcNow.Date,
                ActualCost = 50m
            }
        };

        var service = fixture.CreateService(baseline, progressEntries);

        var export = await service.ExportPmsAsync(fixture.Project.Id);
        var exportedActivity = Assert.Single(export.Activities.Where(x => x.Code == "A-CHILD"));
        var exportedWbs = Assert.Single(Flatten(export.WbsNodes).Where(x => x.Code == "01.01"));

        // Current EVM AC follows PmsEvmService semantics: use the greater of
        // opening/current Activity.ActualCost and accumulated dated period costs.
        Assert.Equal(125m, exportedActivity.ActualCost);
        Assert.Equal(125m, exportedWbs.ActualCost);
        Assert.Equal(125m, export.ActualCost);
    }

    private static Fixture CreateFixture()
    {
        var projectId = Guid.NewGuid();
        var companyId = Guid.NewGuid();
        var rootId = Guid.NewGuid();
        var childId = Guid.NewGuid();

        var project = new Project
        {
            Id = projectId,
            CompanyId = companyId,
            Name = "PMS Weight Test"
        };

        var company = new Company
        {
            Id = companyId,
            Name = "PCS Test Client"
        };

        // Persisted WBS budgets intentionally contain stale values. The PMS
        // read/export paths must derive weights from the current Activity data.
        var root = new WbsNode
        {
            Id = rootId,
            ProjectId = projectId,
            Code = "01",
            Name = "Project",
            Level = 1,
            Path = "01",
            Budget = 9999m
        };

        var child = new WbsNode
        {
            Id = childId,
            ProjectId = projectId,
            ParentId = rootId,
            Code = "01.01",
            Name = "Engineering",
            Level = 2,
            Path = "01/01.01",
            Budget = 9999m
        };

        var activities = new[]
        {
            new Activity
            {
                Id = Guid.NewGuid(),
                ProjectId = projectId,
                WbsNodeId = childId,
                Code = "A-CHILD",
                Name = "Child activity",
                Budget = 100m,
                Weight = 12m,
                ActualCost = 100m,
                Progress = 50m
            },
            new Activity
            {
                Id = Guid.NewGuid(),
                ProjectId = projectId,
                WbsNodeId = childId,
                Code = "A-CHILD-2",
                Name = "Second child activity",
                Budget = 300m,
                Progress = 100m
            },
            new Activity
            {
                Id = Guid.NewGuid(),
                ProjectId = projectId,
                WbsNodeId = rootId,
                Code = "A-ROOT",
                Name = "Direct root activity",
                Budget = 100m,
                Progress = 100m
            }
        };

        return new Fixture(
            project,
            company,
            [root, child],
            activities);
    }

    private static IEnumerable<WbsNodeDto> Flatten(IEnumerable<WbsNodeDto> nodes)
    {
        foreach (var node in nodes)
        {
            yield return node;
            foreach (var child in Flatten(node.Children))
                yield return child;
        }
    }

    private sealed record Fixture(
        Project Project,
        Company Company,
        IReadOnlyList<WbsNode> WbsNodes,
        IReadOnlyList<Activity> Activities)
    {
        public PmsService CreateService(
            ProjectBaselineSnapshotDto? baseline = null,
            IEnumerable<ProgressEntry>? progressEntries = null) => new(
            new FakeRepository<Project>([Project], x => x.Id),
            new FakeRepository<Company>([Company], x => x.Id),
            new FakeRepository<WbsNode>(WbsNodes, x => x.Id),
            new FakeRepository<Activity>(Activities, x => x.Id),
            new FakeRepository<ProgressEntry>(progressEntries ?? [], x => x.Id),
            new FakeUnitOfWork(),
            new WbsCalculationService(),
            new StubBaselineService(baseline));
    }

    private sealed class StubBaselineService(ProjectBaselineSnapshotDto? snapshot)
        : IPmsBaselineService
    {
        public Task<ProjectBaselineSnapshotDto?> GetActiveSnapshotAsync(Guid projectId) =>
            Task.FromResult(snapshot);

        public Task<ProjectBaselineSnapshotDto?> GetSnapshotForDateAsync(Guid projectId, DateTime dataDate) =>
            Task.FromResult(snapshot);

        public Task<ProjectBaselineSnapshotDto> CreateDraftAsync(
            Guid projectId,
            CreateProjectBaselineDto request,
            string? createdBy) => throw new NotSupportedException();

        public Task<ProjectBaselineDto> ApproveAsync(
            Guid projectId,
            Guid baselineId,
            string? approvedBy) => throw new NotSupportedException();

        public Task<IReadOnlyList<ProjectBaselineDto>> GetAllAsync(Guid projectId) =>
            throw new NotSupportedException();
    }

    private sealed class FakeUnitOfWork : IUnitOfWork
    {
        public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default) =>
            Task.FromResult(0);

        public Task BeginTransactionAsync() => Task.CompletedTask;
        public Task CommitTransactionAsync() => Task.CompletedTask;
        public Task RollbackTransactionAsync() => Task.CompletedTask;
    }

    private sealed class FakeRepository<T>(
        IEnumerable<T> seed,
        Func<T, Guid> idSelector) : IGenericRepository<T>
        where T : class
    {
        private readonly List<T> _items = seed.ToList();

        public Task<IEnumerable<T>> GetAllAsync() =>
            Task.FromResult<IEnumerable<T>>(_items);

        public Task<T?> GetByIdAsync(Guid id) =>
            Task.FromResult(_items.FirstOrDefault(x => idSelector(x) == id));

        public Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
        {
            var compiled = predicate.Compile();
            return Task.FromResult<IEnumerable<T>>(_items.Where(compiled).ToList());
        }

        public Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate) =>
            Task.FromResult(_items.FirstOrDefault(predicate.Compile()));

        public Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate) =>
            Task.FromResult(_items.Any(predicate.Compile()));

        public Task<int> CountAsync() => Task.FromResult(_items.Count);

        public Task<int> CountAsync(Expression<Func<T, bool>> predicate) =>
            Task.FromResult(_items.Count(predicate.Compile()));

        public Task AddAsync(T entity)
        {
            _items.Add(entity);
            return Task.CompletedTask;
        }

        public Task AddRangeAsync(IEnumerable<T> entities)
        {
            _items.AddRange(entities);
            return Task.CompletedTask;
        }

        public void Update(T entity) { }
        public void Delete(T entity) => _items.Remove(entity);

        public void DeleteRange(IEnumerable<T> entities)
        {
            foreach (var entity in entities)
                _items.Remove(entity);
        }

        public Task SaveChangesAsync() => Task.CompletedTask;
    }
}
