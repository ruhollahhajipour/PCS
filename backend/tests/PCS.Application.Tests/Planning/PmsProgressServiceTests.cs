using System.Linq.Expressions;
using PCS.Application.Common.Interfaces;
using PCS.Application.Planning.DTOs;
using PCS.Application.Planning.Interfaces;
using PCS.Application.Planning.Services;
using PCS.Domain.Entities.Planning;

namespace PCS.Application.Tests.Planning;

public sealed class PmsProgressServiceTests
{
    [Fact]
    public async Task CalculateWbsProgressAsync_IncludesNestedActivitiesAndUsesBudgetWeights()
    {
        var projectId = Guid.NewGuid();
        var rootId = Guid.NewGuid();
        var childId = Guid.NewGuid();
        var otherProjectId = Guid.NewGuid();

        var nodes = new[]
        {
            new WbsNode
            {
                Id = rootId,
                ProjectId = projectId,
                Code = "01",
                Level = 1
            },
            new WbsNode
            {
                Id = childId,
                ProjectId = projectId,
                ParentId = rootId,
                Code = "01.01",
                Level = 2
            },
            new WbsNode
            {
                ProjectId = otherProjectId,
                ParentId = rootId,
                Code = "OTHER",
                Level = 2
            }
        };

        var activities = new[]
        {
            new Activity
            {
                ProjectId = projectId,
                WbsNodeId = rootId,
                Budget = 100m,
                Weight = 9999m,
                Progress = 50m
            },
            new Activity
            {
                ProjectId = projectId,
                WbsNodeId = childId,
                Budget = 300m,
                Weight = 1m,
                Progress = 100m
            },
            new Activity
            {
                ProjectId = otherProjectId,
                WbsNodeId = nodes[2].Id,
                Budget = 10000m,
                Progress = 0m
            }
        };

        var service = CreateService(nodes, activities, null);

        var progress = await service.CalculateWbsProgressAsync(rootId);

        Assert.Equal(87.5m, progress);
    }

    [Fact]
    public async Task CalculateProjectProgressAsync_UsesApprovedBaselineBudgetWeights()
    {
        var projectId = Guid.NewGuid();
        var firstActivityId = Guid.NewGuid();
        var secondActivityId = Guid.NewGuid();
        var activities = new[]
        {
            new Activity
            {
                Id = firstActivityId,
                ProjectId = projectId,
                Budget = 100m,
                Weight = 9999m,
                Progress = 50m
            },
            new Activity
            {
                Id = secondActivityId,
                ProjectId = projectId,
                Budget = 300m,
                Weight = 1m,
                Progress = 100m
            }
        };
        var baseline = new ProjectBaselineSnapshotDto
        {
            Id = Guid.NewGuid(),
            ProjectId = projectId,
            Name = "Approved Baseline",
            Version = 1,
            TotalBudget = 400m,
            IsApproved = true,
            IsActive = true,
            Activities =
            [
                new ProjectBaselineActivityDto { ActivityId = firstActivityId, Budget = 300m },
                new ProjectBaselineActivityDto { ActivityId = secondActivityId, Budget = 100m }
            ]
        };

        var service = CreateService([], activities, baseline);

        var progress = await service.CalculateProjectProgressAsync(projectId);

        Assert.Equal(62.5m, progress);
    }

    private static PmsProgressService CreateService(
        IEnumerable<WbsNode> nodes,
        IEnumerable<Activity> activities,
        ProjectBaselineSnapshotDto? baseline) =>
        new(
            new FakeRepository<WbsNode>(nodes),
            new FakeRepository<Activity>(activities),
            new StubBaselineService(baseline));

    private sealed class StubBaselineService(ProjectBaselineSnapshotDto? snapshot)
        : IPmsBaselineService
    {
        public Task<ProjectBaselineSnapshotDto?> GetActiveSnapshotAsync(Guid projectId) =>
            Task.FromResult(snapshot);

        public Task<ProjectBaselineSnapshotDto?> GetSnapshotForDateAsync(Guid projectId, DateTime dataDate) =>
            Task.FromResult(snapshot);

        public Task<ProjectBaselineSnapshotDto> CreateDraftAsync(
            Guid projectId, CreateProjectBaselineDto request, string? createdBy) =>
            throw new NotSupportedException();

        public Task<ProjectBaselineDto> ApproveAsync(
            Guid projectId, Guid baselineId, string? approvedBy) =>
            throw new NotSupportedException();

        public Task<IReadOnlyList<ProjectBaselineDto>> GetAllAsync(Guid projectId) =>
            throw new NotSupportedException();
    }

    private sealed class FakeRepository<T>(IEnumerable<T> seed) : IGenericRepository<T>
        where T : class
    {
        private readonly List<T> _items = seed.ToList();

        public Task<IEnumerable<T>> GetAllAsync() =>
            Task.FromResult<IEnumerable<T>>(_items);

        public Task<T?> GetByIdAsync(Guid id) =>
            Task.FromResult<T?>(_items.FirstOrDefault(item =>
                item.GetType().GetProperty("Id")?.GetValue(item) is Guid itemId &&
                itemId == id));

        public Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate) =>
            Task.FromResult<IEnumerable<T>>(_items.Where(predicate.Compile()).ToList());

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
