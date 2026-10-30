using System.Linq.Expressions;
using PCS.Application.Common.Interfaces;
using PCS.Application.Planning.DTOs;
using PCS.Application.Planning.Interfaces;
using PCS.Application.Planning.Services;
using PCS.Domain.Entities.Planning;

namespace PCS.Application.Tests.Planning;

public sealed class ProgressEntryServiceTests
{
    [Fact]
    public async Task AddProgressAsync_RejectsDateAlreadyUsedBySoftDeletedEntry()
    {
        var activityId = Guid.NewGuid();
        var date = new DateTime(2020, 1, 6);
        var progressRepository = new FakeRepository<ProgressEntry>(
        [
            new ProgressEntry
            {
                ActivityId = activityId,
                ProgressDate = date,
                IsDeleted = true
            }
        ]);
        var service = new ProgressEntryService(
            progressRepository,
            new FakeRepository<Activity>([new Activity { Id = activityId }]),
            new StubBaselineService());

        await Assert.ThrowsAsync<InvalidOperationException>(
            () => service.AddProgressAsync(activityId, date, 20m, 10m));

        Assert.Single(await progressRepository.GetAllAsync());
    }

    [Fact]
    public async Task AddProgressAsync_OlderEntryDoesNotReplaceLatestActivityProgress()
    {
        var activityId = Guid.NewGuid();
        var activity = new Activity
        {
            Id = activityId,
            ProjectId = Guid.NewGuid(),
            Progress = 55m,
            ActualCost = 100m
        };
        var progressRepository = new FakeRepository<ProgressEntry>(
        [
            new ProgressEntry
            {
                ActivityId = activityId,
                ProgressDate = new DateTime(2020, 1, 5),
                Progress = 55m,
                ActualCost = 20m
            }
        ]);
        var service = new ProgressEntryService(
            progressRepository,
            new FakeRepository<Activity>([activity]),
            new StubBaselineService());

        await service.AddProgressAsync(
            activityId,
            new DateTime(2020, 1, 4),
            35m,
            25m);

        Assert.Equal(55m, activity.Progress);
        Assert.Equal(125m, activity.ActualCost);
        Assert.Equal(2, (await progressRepository.GetAllAsync()).Count());
    }

    private sealed class StubBaselineService : IPmsBaselineService
    {
        public Task<ProjectBaselineSnapshotDto?> GetSnapshotForDateAsync(
            Guid projectId, DateTime dataDate) => Task.FromResult<ProjectBaselineSnapshotDto?>(null);

        public Task<ProjectBaselineSnapshotDto?> GetActiveSnapshotAsync(Guid projectId) =>
            Task.FromResult<ProjectBaselineSnapshotDto?>(null);

        public Task<ProjectBaselineSnapshotDto> CreateDraftAsync(
            Guid projectId, CreateProjectBaselineDto request, string? createdBy) =>
            throw new NotSupportedException();

        public Task<ProjectBaselineDto> ApproveAsync(
            Guid projectId, Guid baselineId, string? approvedBy) =>
            throw new NotSupportedException();

        public Task<IReadOnlyList<ProjectBaselineDto>> GetAllAsync(Guid projectId) =>
            throw new NotSupportedException();
    }

    private sealed class FakeRepository<T>(IEnumerable<T>? seed = null)
        : IGenericRepository<T>
        where T : class
    {
        private readonly List<T> _items = seed?.ToList() ?? [];

        public Task<IEnumerable<T>> GetAllAsync() => Task.FromResult<IEnumerable<T>>(_items);

        public Task<T?> GetByIdAsync(Guid id)
        {
            var entity = _items.FirstOrDefault(item =>
                item.GetType().GetProperty("Id")?.GetValue(item) is Guid itemId &&
                itemId == id);
            return Task.FromResult(entity);
        }

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
