using System.Linq.Expressions;
using PCS.Application.Common.Interfaces;
using PCS.Application.Planning.DTOs;
using PCS.Application.Planning.Interfaces;
using PCS.Application.Planning.Services;
using PCS.Domain.Entities;
using PCS.Domain.Entities.Planning;

namespace PCS.Application.Tests.Planning;

public sealed class PmsDashboardProgressTests
{
    [Fact]
    public async Task GetProjectDashboardAsync_UsesBudgetWeightsInsteadOfLegacyActivityWeight()
    {
        var projectId = Guid.NewGuid();
        var project = new Project { Id = projectId, Name = "Budget Weighted Project" };
        var activities = new[]
        {
            new Activity
            {
                Id = Guid.NewGuid(),
                ProjectId = projectId,
                Budget = 100m,
                Weight = 1m,
                Progress = 50m
            },
            new Activity
            {
                Id = Guid.NewGuid(),
                ProjectId = projectId,
                Budget = 300m,
                Weight = 9999m,
                Progress = 100m
            }
        };

        var service = CreateService(project, activities, null);

        var dashboard = await service.GetProjectDashboardAsync(projectId);

        Assert.Equal(400m, dashboard.Budget);
        Assert.Equal(87.5m, dashboard.Progress);
    }

    [Fact]
    public async Task GetProjectDashboardAsync_UsesApprovedBaselineBudgetForProgressWeights()
    {
        var projectId = Guid.NewGuid();
        var firstActivityId = Guid.NewGuid();
        var secondActivityId = Guid.NewGuid();
        var project = new Project { Id = projectId, Name = "Baseline Weighted Project" };
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

        var service = CreateService(project, activities, baseline);

        var dashboard = await service.GetProjectDashboardAsync(projectId);

        Assert.Equal(400m, dashboard.Budget);
        Assert.Equal(62.5m, dashboard.Progress);
    }

    private static PmsDashboardService CreateService(
        Project project,
        IReadOnlyCollection<Activity> activities,
        ProjectBaselineSnapshotDto? baseline) =>
        new(
            new FakeRepository<Project>([project]),
            new FakeRepository<Activity>(activities),
            new StubEvmService(),
            new StubBaselineService(baseline));

    private sealed class StubEvmService : IPmsEvmService
    {
        public Task<EvmResultDto> CalculateAsync(Guid projectId, DateTime reportDate) =>
            Task.FromResult(new EvmResultDto { ProjectId = projectId, ReportDate = reportDate });
    }

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
